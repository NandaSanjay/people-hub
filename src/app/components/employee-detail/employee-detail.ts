import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { EmployeeService } from "../../services/employee.service";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { BreadcrumbService } from "../../services/breadcrumb";
import { MatChipsModule } from "@angular/material/chips";

@Component({
  selector: "app-employee-detail",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatChipsModule],
  templateUrl: "./employee-detail.html",
  styleUrls: ["./employee-detail.css"],
})
export class EmployeeDetailComponent implements OnInit {
  employee: any = null;
  activeTab: string = "profile";
  isEditOpen = false;
  editableEmployee: any = {};
  editForm: any = {};
  profileImageUrl: string =
    "https://via.placeholder.com/150/3f51b5/ffffff?text=Profile";
  defaultImageUrl: string =
    "https://via.placeholder.com/150/3f51b5/ffffff?text=Profile";

  selectTab(tab: string) {
    this.activeTab = tab;
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageUrl = e.target.result;
        if (this.employee) {
          this.employee.profileImage = e.target.result;
        }
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  triggerImageUpload() {
    const fileInput = document.getElementById(
      "imageUpload",
    ) as HTMLInputElement;
    fileInput?.click();
  }

  constructor(
    private route: ActivatedRoute,
    private empService: EmployeeService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
  ) {}

  openEdit() {
    const e = this.employee;

    this.editForm = {
      firstName: e.firstName,
      lastName: e.lastName,
      email: e.email,
      phone: e.phone,

      department: e.company?.department,
      companyName: e.company?.name,

      status: e.status || "active",

      address: e.address?.address,
      city: e.address?.city,
    };

    this.isEditOpen = true;
  }

  closeEdit() {
    this.isEditOpen = false;
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get("id"));

    this.empService.getEmployees().subscribe((res) => {
      const emp = res.users.find((e: any) => e.id === id);

      this.employee = emp ? { ...emp } : null;

      if (this.employee) {
        this.breadcrumbService.setBreadcrumbs([
          { label: "Employees", url: "/employees" },
          {
            label: `${this.employee.firstName} ${this.employee.lastName}`,
            url: "",
          },
        ]);
      }

      this.cdr.detectChanges();
    });
    ``;
  }

  saveEmployee() {
    const payload = {
      ...this.employee,

      firstName: this.editForm.firstName,
      lastName: this.editForm.lastName,
      email: this.editForm.email,
      phone: this.editForm.phone,

      company: {
        ...this.employee.company,
        department: this.editForm.department,
        name: this.editForm.companyName,
      },

      address: {
        ...this.employee.address,
        address: this.editForm.address,
        city: this.editForm.city,
      },

      status: this.editForm.status,
    };

    console.log("✅ API Payload:", payload);

    this.employee = { ...payload };

    this.closeEdit();
  }

  get initials() {
    return this.employee.firstName[0] + this.employee.lastName[0];
  }
}
