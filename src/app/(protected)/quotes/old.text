'use client'

import DashboardLayout from '../DashboardLayout'
import { UniversalTable, renderStatus, renderButton } from '@/app/components/tables/UniversalTable'

// Quotes-ի տվյալներ
const quotesRows = [
  {
    id: 'Q-005',
    cargo: 'Electronics',
    shipmentValue: '$15,400.00',
    premiumAmount: '$450.00',
    expirationDate: 'Oct 25 – Nov 5',
    status: { 
      text: 'Pending Approval', 
      color: 'bg-[#cbd03c]/10', 
      dot: 'bg-[#cbd03c]', 
      textColor: 'text-[#cbd03c]' 
    },
    button: { 
      text: 'Approve Quote', 
      variant: 'primary' as const,
      onClick: (row: any) => console.log('Approve Quote', row.id)
    }
  },
  {
    id: 'Q-021',
    cargo: 'Furniture',
    shipmentValue: '$20,000.00',
    premiumAmount: '$255.00',
    expirationDate: 'Oct 20 – Nov 1',
    status: { 
      text: 'Approved', 
      color: 'bg-[#16a34a]/10', 
      dot: 'bg-[#16a34a]', 
      textColor: 'text-[#16a34a]' 
    },
    button: { 
      text: 'Approve Quote', 
      variant: 'primary' as const,
      onClick: (row: any) => console.log('Approve Quote', row.id)
    }
  },
  {
    id: 'Q-054',
    cargo: 'Clothing',
    shipmentValue: '$5,500.00',
    premiumAmount: '$600.00',
    expirationDate: 'Oct 22 – Nov 3',
    status: { 
      text: 'Declined', 
      color: 'bg-[#8ea0b0]/10', 
      dot: 'bg-[#8ea0b0]', 
      textColor: 'text-[#8ea0b0]' 
    },
    button: { 
      text: 'View Reason', 
      variant: 'secondary' as const,
      onClick: (row: any) => console.log('View Reason', row.id)
    }
  },
  {
    id: 'Q-005-2',
    cargo: 'Machinery',
    shipmentValue: '$8,500.00',
    premiumAmount: '$165.00',
    expirationDate: 'Oct 24 – Nov 4',
    status: { 
      text: 'Pending Approval', 
      color: 'bg-[#cbd03c]/10', 
      dot: 'bg-[#cbd03c]', 
      textColor: 'text-[#cbd03c]' 
    },
    button: { 
      text: 'Approve Quote', 
      variant: 'primary' as const,
      onClick: (row: any) => console.log('Approve Quote', row.id)
    }
  },
  {
    id: 'Q-014',
    cargo: 'Chemicals',
    shipmentValue: '$12,800.00',
    premiumAmount: '$360.00',
    expirationDate: 'Oct 21 – Nov 2',
    status: { 
      text: 'Approved', 
      color: 'bg-[#16a34a]/10', 
      dot: 'bg-[#16a34a]', 
      textColor: 'text-[#16a34a]' 
    },
    button: { 
      text: 'Approve Quote', 
      variant: 'primary' as const,
      onClick: (row: any) => console.log('Approve Quote', row.id)
    }
  }
]

const quotesColumns = [
  {
    key: 'id',
    label: 'Quote ID',
    sortable: true,
    renderDesktop: (value: string) => (
      <span className="font-poppins text-sm text-[#2563eb] underline hover:text-[#1d4ed8] transition-colors duration-300 cursor-pointer">
        {value}
      </span>
    )
  },
  {
    key: 'cargo',
    label: 'Cargo',
    sortable: true
  },
  {
    key: 'shipmentValue',
    label: 'Shipment Value',
    sortable: true
  },
  {
    key: 'premiumAmount',
    label: 'Premium Amount',
    sortable: true
  },
  {
    key: 'expirationDate',
    label: 'Expiration Date',
    sortable: true
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    renderDesktop: (status: any) => renderStatus(status)
  },
  {
    key: 'button',
    label: 'Action',
    renderDesktop: (button: any, row: any) => renderButton(button, row),
    className: 'flex justify-end'
  }
];


export default function QuotesPage() {
  return (
    <DashboardLayout>
      <div className="w-full max-w-[99%] mx-auto">
        {/* Mobile Header for Activity Section */}
        <div className="flex gap-2 items-center mb-2 xl:hidden">
          <img
            src="/dashboard/hashtag.svg"
            alt=""
            className="w-[22px] h-[22px] sm:w-5 sm:h-5"
          />
          <h2 className="font-normal text-[18px] sm:text-lg">
            All Insurance Quotes
          </h2>
        </div>

        {/* Universal Table for Quotes */}
        <UniversalTable
  title="All Insurance Quotes"
  showMobileHeader={true}
  rows={quotesRows}
  columns={quotesColumns}
  mobileDesign={{
    showType: false, // Quotes-ում type չկա
    showCargoIcon: true,
    showDateIcon: true,
    dateLabel: 'Expires',
    buttonWidth: '47%'
  }}
/>
      </div>
    </DashboardLayout>
  )
}