import Link from "next/link"
import { GallerySection } from "@/components/gallery-section"
import { SocialIcons } from "@/components/social-icons"
import { Button } from "@/components/ui/button"
import { HeroGallery } from "@/components/hero-gallery"

export default function Home() {
  return (
    <div className="min-h-screen bg-pink-50">
      {/* Top bar with contact info */}
      <div className="bg-brand-pink text-white py-2">
        <div className="container mx-auto px-4 flex justify-end">
          <SocialIcons variant="header" />
        </div>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-10 bg-white shadow-md">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-brand-pink">Julia Villagómez</div>
          <div className="flex items-center gap-4">
            <Link href="/#inicio">
              <Button variant="ghost" className="text-brand-pink hover:text-brand-pink-dark hover:bg-pink-50">
                Inicio
              </Button>
            </Link>
            <Link href="/#carrera">
              <Button variant="ghost" className="text-brand-pink hover:text-brand-pink-dark hover:bg-pink-50">
                Carrera Profesional
              </Button>
            </Link>
            <Link href="/#propuestas">
              <Button variant="ghost" className="text-brand-pink hover:text-brand-pink-dark hover:bg-pink-50">
                Propuestas
              </Button>
            </Link>
            <Link href="/admin">
              <Button
                variant="outline"
                className="text-brand-olive border-brand-olive hover:bg-brand-olive hover:text-white"
              >
                Admin
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section with Gallery */}
        <section id="inicio" className="py-12 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-pink mb-4">Trabajando por un mejor futuro</h1>
            <p className="text-lg text-gray-700 mb-6">
              Comprometida con el desarrollo y bienestar de nuestra comunidad. Juntos podemos lograr el cambio que
              necesitamos.
            </p>
            <Button className="bg-brand-pink hover:bg-brand-pink-dark text-white">Conoce mis propuestas</Button>
          </div>
          <div className="md:w-1/2">
            <HeroGallery />
          </div>
        </section>

        {/* Gallery Sections */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-brand-pink mb-8 text-center">Galerías</h2>

          <div className="space-y-12">
            <GallerySection
              title="Eventos Comunitarios"
              id="eventos"
              description="Participación en eventos con la comunidad"
            />

            <GallerySection
              title="Actividades Políticas"
              id="actividades"
              description="Actividades políticas y reuniones importantes"
            />

            <GallerySection
              title="Propuestas en Acción"
              id="propuestas-accion"
              description="Implementación de propuestas y proyectos"
            />
          </div>
        </section>

        {/* Career Section */}
        <section id="carrera" className="py-12 bg-white rounded-lg shadow-md p-8 border-t-4 border-brand-pink">
          <h2 className="text-3xl font-bold text-brand-pink mb-8">Carrera Profesional</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-brand-olive pl-4">
              <h3 className="text-xl font-semibold text-brand-pink">2018 - Presente</h3>
              <p className="text-gray-700">Directora de Desarrollo Comunitario</p>
            </div>
            <div className="border-l-4 border-brand-olive pl-4">
              <h3 className="text-xl font-semibold text-brand-pink">2015 - 2018</h3>
              <p className="text-gray-700">Coordinadora de Proyectos Sociales</p>
            </div>
            <div className="border-l-4 border-brand-olive pl-4">
              <h3 className="text-xl font-semibold text-brand-pink">2010 - 2015</h3>
              <p className="text-gray-700">Asesora en Políticas Públicas</p>
            </div>
          </div>
        </section>

        {/* Proposals Section */}
        <section id="propuestas" className="py-12">
          <h2 className="text-3xl font-bold text-brand-pink mb-8">Propuestas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-brand-pink">
              <h3 className="text-xl font-semibold text-brand-pink mb-3">Educación</h3>
              <p className="text-gray-700">
                Mejorar la infraestructura educativa y ampliar los programas de becas para estudiantes.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-brand-pink">
              <h3 className="text-xl font-semibold text-brand-pink mb-3">Salud</h3>
              <p className="text-gray-700">
                Ampliar la cobertura de servicios médicos y mejorar la calidad de atención en centros de salud.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-brand-pink">
              <h3 className="text-xl font-semibold text-brand-pink mb-3">Seguridad</h3>
              <p className="text-gray-700">
                Implementar programas de prevención del delito y fortalecer la seguridad comunitaria.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-brand-olive text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Contacto</h3>
              <p>lic.juliavillagomez31@gmail.com</p>
              <p>Tel: 229 422 4577</p>
            </div>
            <div>
              <p>&copy; {new Date().getFullYear()} Campaña Julia Villagómez. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
