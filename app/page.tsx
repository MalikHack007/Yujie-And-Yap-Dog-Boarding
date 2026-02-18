import Introduction from "./components/landing-page/introduction";
import CustomerTestimonials from "./components/landing-page/testimonials";
import PhotoGallery from "./components/landing-page/photogallery";
import CallToAction from "./components/landing-page/calltoaction";

export default function Home() {
  return (
      <main className="flex flex-col w-full">
            <Introduction />
            <CustomerTestimonials />
            <PhotoGallery />
            <CallToAction />
      </main>
  );
}
