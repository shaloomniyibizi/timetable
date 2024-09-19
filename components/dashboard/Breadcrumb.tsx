import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

interface BreadcrumbItem {
  name: string;
  path: string;
}

const Breadcrumbs = ({ items }: { items: BreadcrumbItem[] }) => {
  return (
    <>
      <Breadcrumb className='flex'>
        <BreadcrumbList>
          {items.map((item, index) => (
            <div key={index}>
              {index === items.length - 1 ? (
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <BreadcrumbPage>{item.name}</BreadcrumbPage>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              ) : (
                <div className='flex items-center gap-4'>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={item.path}>{item.name}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </div>
              )}
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};

export default Breadcrumbs;
