const puppeteer = require("puppeteer");
const fs = require("fs");

const ano = 2023;
const semestre = 2;
const depto = "CIC";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(
    `https://www.dti.ufv.br/horario_crp/horario.asp?ano=${ano}&semestre=${semestre}&depto=${depto}`
  );
  const data = await page.evaluate(() => {
    const tables = document.querySelectorAll("table");
    const table = Array.from(tables).find((item) => {
      return item.getAttribute("width") === "98%";
    });

    const data = [];
    for (let i = 1; i < table.rows.length; i++) {
      const row = table.rows[i];
      const rowData = {
        Cod: row.cells[0].textContent.trim(),
        Disciplina: row.cells[1].textContent.trim(),
        Tipo: row.cells[2].textContent.trim(),
        N: row.cells[3].textContent.trim(),
        Horario: row.cells[4].textContent.trim(),
        Sala: row.cells[5].textContent.trim(),
        VgCurso: row.cells[6].textContent.trim(),
        VgTotal: row.cells[7].textContent.trim(),
        VgLiv: row.cells[8].textContent.trim(),
        Prof: "",
        Idioma: row.cells[10].textContent.trim(),
      };

      data.push(rowData);
    }

    return data;
  });

  fs.writeFile(
    `${depto}-${ano}-${semestre}.json`,
    JSON.stringify(data, null, 2),
    (err) => {
      if (err) {
        throw new Error(err);
      }
    }
  );
  await browser.close();
})();
