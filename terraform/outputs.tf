output "vm_public_ip" {
  description = "Public IP of the MeetSou VM"
  value       = google_compute_address.meetsou_ip.address
}

output "ssh_command" {
  description = "SSH into the VM"
  value       = "ssh debian@${google_compute_address.meetsou_ip.address}"
}

output "app_url" {
  description = "MeetSou app URL"
  value       = "http://${google_compute_address.meetsou_ip.address}"
}
