import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

if (!dist.startsWith(`${root}${sep}`)) {
  throw new Error("Destino de build inválido.");
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const directory of ["css", "js"]) {
  await cp(join(root, directory), join(dist, directory), { recursive: true });
}
await cp(join(root, "assets", "images"), join(dist, "assets", "images"), { recursive: true });

for (const file of await readdir(root)) {
  if (file.endsWith(".html") || file === "README.txt") {
    await cp(join(root, file), join(dist, file));
  }
}

const requiredFiles = ["index.html", "contato.html", "servicos.html", "css/style.css", "js/main.js"];
for (const file of requiredFiles) {
  const info = await stat(join(dist, file));
  if (!info.isFile()) throw new Error(`Arquivo obrigatório ausente: ${file}`);
}

console.log(`Build concluído em ${dist}`);
