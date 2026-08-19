import { NotFoundGlitch } from "@/components/ui/be-ui-404-not-found";

export default function Custom404() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black">
      <NotFoundGlitch
        homeHref="/"
        homeLabel="Go home"
        browseHref="/creators"
        browseLabel="Browse pages"
      />
    </div>
  );
}