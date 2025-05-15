import CardIcon from "@/components/ShoppingCart";
import DrawerExample from "@/components/DrawerExample";
import AdvancedDrawerExample from "@/components/AdvancedDrawerExample";

export default function Home() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <div className="p-4 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Drawer 组件示例</h1>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">基础示例</h2>
          <DrawerExample />
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">高级示例</h2>
          <AdvancedDrawerExample />
        </section>
      </div>
      
      <div className="fixed right-5 bottom-20">
        <CardIcon />
      </div>
    </div>
  );
}
