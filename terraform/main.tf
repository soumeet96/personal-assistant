terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  credentials = file(var.credentials_file)
  project     = var.project_id
  region      = var.region
  zone        = var.zone
}

# Static public IP
resource "google_compute_address" "meetsou_ip" {
  name   = "meetsou-static-ip"
  region = var.region
}

# Firewall — allow SSH, HTTP, HTTPS, k3s API
resource "google_compute_firewall" "meetsou_firewall" {
  name    = "meetsou-firewall"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["22", "80", "443", "6443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["meetsou"]
}

# e2-micro VM (always free in us-central1)
resource "google_compute_instance" "meetsou_vm" {
  name         = var.vm_name
  machine_type = var.machine_type
  zone         = var.zone
  tags         = ["meetsou"]

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-12"
      size  = 30  # GB — free tier limit
      type  = "pd-standard"
    }
  }

  network_interface {
    network = "default"
    access_config {
      nat_ip = google_compute_address.meetsou_ip.address
    }
  }

  # Install k3s on first boot
  metadata_startup_script = <<-EOF
    #!/bin/bash
    set -e
    apt-get update -y
    apt-get install -y curl

    # Install k3s
    curl -sfL https://get.k3s.io | sh -

    # Allow non-root kubectl access
    mkdir -p /root/.kube
    cp /etc/rancher/k3s/k3s.yaml /root/.kube/config

    # Make kubeconfig readable for CI/CD
    chmod 644 /etc/rancher/k3s/k3s.yaml
  EOF

  metadata = {
    enable-oslogin = "TRUE"
  }

  service_account {
    scopes = ["cloud-platform"]
  }
}
