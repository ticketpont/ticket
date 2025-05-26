document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  const fields = [
    { key: "nt", label: "Numéro de transaction" },
    { key: "cp", label: "Code produit" },
    { key: "np", label: "Nom produit", blankAfter: true },
    { key: "ie", label: "Identifiant entrée" },
    { key: "ne", label: "Numéro entrée" },
    { key: "de", label: "Date entrée" },
    { key: "he", label: "Heure entrée" },
    { key: "pe", label: "Poids entrée (kg)", blankAfter: true },
    { key: "is", label: "Identifiant sortie" },
    { key: "ns", label: "Numéro sortie" },
    { key: "ds", label: "Date sortie" },
    { key: "hs", label: "Heure sortie" },
    { key: "ps", label: "Poids sortie (kg)", blankAfter: true },
    { key: "pn", label: "Poids net (kg)", highlight: true }
  ];

  const header = document.getElementById("header");
  const table = document.getElementById("ticket-table");
  const btn = document.getElementById("download-btn");

  const ad = params.get("ad");
  if (ad) {
    header.textContent = decodeURIComponent(ad).replace(/\+/g, " ").replace(/%0A/g, "\\n");
  }

  fields.forEach(field => {
    const value = params.get(field.key);
    if (value && field.label) {
      const row = document.createElement("tr");
      if (field.highlight) row.classList.add("highlight");

      const labelCell = document.createElement("td");
      const valueCell = document.createElement("td");
      labelCell.textContent = field.label;
      valueCell.textContent = decodeURIComponent(value).replace(/\+/g, " ");
      row.appendChild(labelCell);
      row.appendChild(valueCell);
      table.appendChild(row);

      if (field.blankAfter) {
        const emptyRow = document.createElement("tr");
        const emptyCell = document.createElement("td");
        emptyCell.setAttribute("colspan", 2);
        emptyCell.innerHTML = "&nbsp;";
        emptyRow.appendChild(emptyCell);
        table.appendChild(emptyRow);
      }
    }
  });

  btn.addEventListener("click", () => {
    const ticket = document.getElementById("ticket");
    btn.style.visibility = "hidden";

    html2canvas(ticket).then(canvas => {
      btn.style.visibility = "visible";

      const idVal = params.get("id") || "inconnu";
      const tn = params.get("nt") || "ticket";
      const filename = `Ticket_${idVal}_${tn}.png`;

      canvas.toBlob(blob => {
        const link = document.createElement("a");
        link.download = filename;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      });
    }).catch(() => {
      btn.style.visibility = "visible";
    });
  });
});
