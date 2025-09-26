import Header from '@/components/Header';
import StarBackground from '@/components/StarBackground';
import PropertyManagement from '@/components/PropertyManagement';

export default function ListProperty() {
  return (
    <div className="min-h-screen text-white relative overflow-x-hidden">
      <StarBackground intensity="medium" />
      <Header />
      <div className="relative z-10">
        <PropertyManagement />
      </div>
    </div>
  );
}
