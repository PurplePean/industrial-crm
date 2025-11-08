# NNN CRM - Industrial Property Underwriting

Professional CRM and underwriting tool for NNN (Triple Net) industrial properties.

## Features

### Property Management
- Complete property tracking with address and Crexi integration
- Square footage and rent calculations
- Search by address or Crexi link
- Dark mode with persistent storage

### Advanced Underwriting
- **LTV-based financing** - automatic loan amount calculation
- **All-in cost analysis** - Purchase Price + Improvements + Closing Costs
- **Debt service options** - Standard Amortization vs Interest-Only
- **Operating metrics** - Cap Rate, DSCR, Cash-on-Cash returns
- **Exit analysis** - Equity multiples, remaining loan balance, net proceeds

### Broker Management
- Track broker information (Name, Email, Phone)
- Firm details (Firm Name, Website, Crexi Profile, License #)
- Multi-select brokers per property
- Inline quick-add broker form
- Broker badges on property cards

### User Experience
- Number formatting with commas (1,000,000)
- Real-time calculations
- Responsive design
- Dark mode toggle
- localStorage persistence

## Tech Stack
- React 18
- Tailwind CSS
- localStorage for data persistence
- Netlify deployment

## Deployment

**Production:** main branch → https://crmaxisppoint.netlify.app
**Staging:** dev branch → staging URL

## Development Workflow

```bash
# Development/Staging
git checkout dev
# make changes
git commit -m "Add feature"
git push origin dev
# → Auto-deploys to staging

# Production (when ready)
git checkout main
git merge dev
git push origin main
# → Auto-deploys to production
```

## Version
V1.0 - Initial Release
