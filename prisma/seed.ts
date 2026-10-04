import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

const productosPokemon = [
  { nombre: "Caja de Sobres Pokémon TCG: Scarlet & Violet", categoria: "tcg-boxes", precio: 280.00, imagen: "https://m.media-amazon.com/images/I/91hUKX-tu5L._AC_UF894,1000_QL80_.jpg", descripcion: "Booster Box sellada de fábrica con 36 sobres de la expansión base." },
  { nombre: "Pokémon TCG: 151 Elite Trainer Box", categoria: "tcg-boxes", precio: 550.00, imagen: "https://www.pokemon.com/static-assets/content-assets/cms2-es-xl/img/trading-card-game/series/incrementals/sv035-elite-trainer-box/sv035-elite-trainer-box-169-es.png", descripcion: "Edición especial de Kanto con 9 sobres, funda promocional de Snorlax y accesorios." },
  { nombre: "Crown Zenith Special Collection Box", categoria: "tcg-boxes", precio: 160.00, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxN8BvG0JK-s5xa2ESf2mYaAV0OuAieiCbBSOvG9_nW2PjiO00e8aPzLBb&s=10", descripcion: "Caja de colección con figura promocional de Lucario VSTAR." },
  { nombre: "Charizard Base Set 1999 - PSA 9 Mint", categoria: "psa-cards", precio: 1250.00, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAySjnFWCK_YwdGJ68lMVxoEJUw7s_deCzVSwtSRCxuKxDzWyI7vhKUG4&s=10", descripcion: "Carta holográfica clásica de 1999 graduada por PSA." },
  { nombre: "Rayquaza Gold Star EX Deoxys - PSA 8", categoria: "psa-cards", precio: 2100.00, imagen: "https://i.ebayimg.com/images/g/jyQAAOSwaxln4y9J/s-l1200.png", descripcion: "Una de las cartas Star más raras del juego competitivo." },
  { nombre: "Gengar VMAX Alternate Art - PSA 10", categoria: "psa-cards", precio: 420.00, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtVEyYSaUowxJxjAfMoVeAaSjdZgWHqE7sPyZqfRb6Iw&s=10", descripcion: "Arte alternativo de Fusion Strike en condición Gem Mint." },
  { nombre: "New Nintendo 3DS XL - Edición Sol y Luna", categoria: "consolas", precio: 290.00, imagen: "https://imagenes.hobbyconsolas.com/files/image_640_auto/uploads/imagenes/2023/04/25/6901e942cbb8d.jpeg", descripcion: "Edición limitada en acabado negro mate con grabados de Solgaleo y Lunala." },
  { nombre: "Nintendo 3DS XL - Edición Pikachu Yellow", categoria: "consolas", precio: 310.00, imagen: "https://i.ebayimg.com/images/g/umIAAeSwbyJqLCLh/s-l1200.webp", descripcion: "Consola amarilla con la cara icónica de Pikachu en relieve." },
  { nombre: "Nintendo 2DS Pokéball Edition", categoria: "consolas", precio: 210.00, imagen: "https://http2.mlstatic.com/D_NQ_NP_706364-MCO106092591895_012026-O.webp", descripcion: "Consola portátil funcional con diseño tridimensional de Pokéball." },
  { nombre: "Game Boy Advance SP - Edición Charizard Red", categoria: "consolas", precio: 245.00, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7B4ada-UkCxlmV_4HdO9anfVbVyrmE50Y_SkeR1otXt95EAwGmE3c6DQ&s=10", descripcion: "Modelo AGS-101 con pantalla retroiluminada de alta intensidad." },
  { nombre: "Nintendo DS Lite - Edición Dialga & Palkia", categoria: "consolas", precio: 175.00, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToaJlr3p9Qpb8Y20z38y7AcXi3yyuCS_5yqRQB7BBsdzgPdiFUuHjjsY0&s=10", descripcion: "Carcasa negra metálica con grabado dorado de los legendarios de Sinnoh." },
  { nombre: "Pokémon Esmeralda (GBA) - Cartucho Original", categoria: "juegos", precio: 195.00, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6PE_RTrMfrFiuDASryzLfBmaliNAv7VAJqn5tOBXk9uSDLHYLjBuOUE4&s=10", descripcion: "Cartucho verde translúcido auténtico con etiqueta holográfica." },
  { nombre: "Pokémon Rojo Fuego (GBA) + Wireless Adapter", categoria: "juegos", precio: 160.00, imagen: "https://cdn.wallapop.com/images/10420/lb/63/__/c10420p1288550030/i6660857945.jpg?pictureSize=W800", descripcion: "Cartucho rojo brillante verificado con adaptador inalámbrico oficial." },
  { nombre: "Pokémon Platino (DS) - Completo CIB", categoria: "juegos", precio: 135.00, imagen: "https://http2.mlstatic.com/D_NQ_NP_664884-MCO105360439237_012026-O.webp", descripcion: "Incluye caja original, manuales de instrucción y cartucho NTR-CPUE." },
  { nombre: "Pokémon Cristal (Game Boy Color) - Pila Nueva", categoria: "juegos", precio: 180.00, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTf66woFVgWIeIZxIZ5f3eEgucetgSHtq9PvDxPGYvqw_F4t-7WrMPXbJs&s=10", descripcion: "Cartucho translúcido azul con batería interna recién reemplazada para guardar la partida." },
  { nombre: "Pokémon Ultrasol (3DS) - Sellado", categoria: "juegos", precio: 60.00, imagen: "https://cloud10.todocoleccion.online/videojuegos-consola-nintendo-3ds/tc/2021/09/09/19/286712988.jpg?r=3", descripcion: "Juego físico completamente nuevo en su plástico sellado de fábrica." },
  { nombre: "Peluche Gengar Tamaño Real (40cm)", categoria: "peluches", precio: 45.00, imagen: "https://m.media-amazon.com/images/I/71W0UGVsgnL.jpg", descripcion: "Peluche oficial Pokémon Center con bordados de alta calidad." },
  { nombre: "Llavero Metálico de Pokéball Premium", categoria: "peluches", precio: 12.99, imagen: "https://dcdn-us.mitiendanube.com/stores/806/999/products/llavero-pokebola-pokemon-fotocaja-tienda-geek-cordoba-21-9675878d80c41c03e015591464824592-1024-1024.webp", descripcion: "Llavero macizo en aleación de zinc con esmaltado brillante de Pokéball." },
  { nombre: "Llavero de Metal Master Ball Coleccionable", categoria: "peluches", precio: 14.50, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlNECQTS6QNiEd49_s4oFTe5Y0cH3jWJ0uRGDvZY3k0guOK09RtS_vLdQ&s=10", descripcion: "Acabado morado metálico con el detalle distintivo 'M' grabado en relieve." },
  { nombre: "Figura Articulada Scale World de Blastoise", categoria: "peluches", precio: 38.00, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMPAF-737uf51vEEwmvfMgj4OEV2UAj8rNFLAME7W-rlXgJcQlt2IjJ2w&s=10", descripcion: "Figura a escala 1/20 de la línea Bandai Scale World." },
  { nombre: "Mochila Réplica Pokéball Trainer", categoria: "peluches", precio: 49.99, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjalEzLvulSD1vDKTRv0S_z4Mj5XeVQy6BZ5XmxFdlKL0VPnlXStdQKEY&s=10", descripcion: "Mochila rígida resistente al agua con compartimentos interiores." }
];

async function main() {
  console.log('🔄 Limpiando base de datos...');
  await prisma.pedido.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.user.deleteMany();

  console.log('🎴 Insertando 21 productos...');
  await prisma.producto.createMany({ data: productosPokemon });

  console.log('✅ Seed finalizado.');
}

main().finally(async () => await prisma.$disconnect());