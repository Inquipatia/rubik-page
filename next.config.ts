import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Esto captura todas las rutas
        source: '/((?!mantenimiento|_next|api|favicon.ico).*)',
        // Redirige a la página que crearemos abajo
        destination: '/mantenimiento',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
