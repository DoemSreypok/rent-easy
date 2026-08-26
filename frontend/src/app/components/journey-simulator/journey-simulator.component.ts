import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantPortalComponent } from '../tenant-portal/tenant-portal.component';
import { OwnerPortalComponent } from '../owner-portal/owner-portal.component';
import { ActiveTenancyComponent } from '../active-tenancy/active-tenancy.component';

@Component({
  selector: 'app-journey-simulator',
  standalone: true,
  imports: [
    CommonModule,
    TenantPortalComponent,
    OwnerPortalComponent,
    ActiveTenancyComponent
  ],
  templateUrl: './journey-simulator.component.html',
  styleUrls: ['./journey-simulator.component.scss']
})
export class JourneySimulatorComponent {
  // Portal View Mode passed from App: 'tenant' | 'owner' | 'active-tenancy'
  portalMode = input<'tenant' | 'owner' | 'active-tenancy'>('tenant');

  // Emit auth request to open sign-in modal
  onRequestAuth = output<{ defaultMode?: 'login' | 'register'; defaultRole?: 'tenant' | 'owner' }>();
}
