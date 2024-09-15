import { Button } from '@/components/ui/button';

export const description =
  'A products dashboard with a sidebar navigation and a main content area. The dashboard has a header with a search input and a user menu. The sidebar has a logo, navigation links, and a card with a call to action. The main content area shows an empty state with a call to action.';

export function Dashboard() {
  return (
    <main className='flex flex-1 h-full flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
      <div className='flex items-center'>
        <h1 className='text-lg font-semibold md:text-2xl'>
          Time table generator system
        </h1>
      </div>
      <div
        className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm'
        x-chunk='dashboard-02-chunk-1'
      >
        <div className='flex flex-col items-center gap-1 text-center'>
          <h3 className='text-2xl font-bold tracking-tight'>
            Welcome Mrs/Miss
          </h3>
          <p className='text-sm text-muted-foreground'>
            You can start navigating to the system.
          </p>
          <Button className='mt-4'>Sound amizing</Button>
        </div>
      </div>
    </main>
  );
}
