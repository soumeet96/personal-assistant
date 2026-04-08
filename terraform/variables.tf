variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "credentials_file" {
  description = "Path to GCP service account JSON key"
  type        = string
}

variable "region" {
  description = "GCP region (must be free-tier eligible)"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "GCP zone"
  type        = string
  default     = "us-central1-a"
}

variable "vm_name" {
  description = "Name of the compute instance"
  type        = string
  default     = "meetsou-vm"
}

variable "machine_type" {
  description = "GCP machine type (e2-micro is always free)"
  type        = string
  default     = "e2-micro"
}
