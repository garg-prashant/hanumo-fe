import Header from '@/components/Header';
import PropertyManagement from '@/components/PropertyManagement';

export default function ListProperty() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <Header />
      <PropertyManagement />
    </div>
  );
}
