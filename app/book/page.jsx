import BookingForm from "../components/booking/BookingForm";

export default function BookingPage() {
  return (
    <div className="
      min-h-screen
      flex items-center justify-center
      bg-[var(--color-bg)]
      px-[var(--spacing-4)] py-[var(--spacing-16)]
    ">
      <BookingForm />
    </div>
  );
}