import { Link } from "react-router-dom";
import { Phone, MapPin, Clock, Instagram, Facebook } from "lucide-react";
import logoRoxinho from "@/assets/roxinho-icon.png.asset.json";
import { businessInfo } from "@/data/menu";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-8 md:py-12">
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logoRoxinho.url} alt="Roxinho" className="h-10 w-10 object-contain" />
              <div>
                <h3 className="text-lg font-bold">{businessInfo.name}</h3>
                <p className="text-xs text-muted-foreground">{businessInfo.tagline}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              O seu momento açaí, do seu jeito! Monte seu pote ou escolha um dos nossos Supremos.
            </p>
          </div>

          {/* Links rápidos */}
          <div>
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/cardapio" className="text-muted-foreground hover:text-primary transition-colors">
                  Cardápio
                </Link>
              </li>
              <li>
                <Link to="/montar" className="text-muted-foreground hover:text-primary transition-colors">
                  Monte seu Açaí
                </Link>
              </li>
              <li>
                <Link to="/pedidos" className="text-muted-foreground hover:text-primary transition-colors">
                  Meus Pedidos
                </Link>
              </li>
              <li>
                <Link to="/fidelidade" className="text-muted-foreground hover:text-primary transition-colors">
                  Programa de Fidelidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {businessInfo.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                  {businessInfo.address}
                </li>
              )}
              {businessInfo.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <a
                    href={businessInfo.whatsapp ? `https://wa.me/${businessInfo.whatsapp}` : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    {businessInfo.phone}
                  </a>
                </li>
              )}
              {businessInfo.hours && (
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  {businessInfo.hours}
                </li>
              )}
            </ul>
          </div>

          {/* Redes sociais */}
          <div>
            <h4 className="font-semibold mb-4">Siga-nos</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <hr className="my-8 border-border" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2025 {businessInfo.name}. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <Link to="/termos" className="hover:text-primary transition-colors">
              Termos de Uso
            </Link>
            <Link to="/privacidade" className="hover:text-primary transition-colors">
              Política de Privacidade
            </Link>
          </div>
        </div>

        {/* Discreet admin access dot — larger invisible tap target for mobile */}
        <div className="mt-6 mb-24 md:mb-0 flex justify-center">
          <Link
            to="/admin"
            aria-label="admin"
            title=""
            className="flex h-11 w-11 items-center justify-center rounded-full active:bg-muted/40 transition-colors"
          >
            <span className="block h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
