# 🌸 Grafana Nightingale Pie Chart Panel Plugin (with ECharts)

This custom Grafana panel plugin renders a **Nightingale-style (rose) pie chart** using the [Apache ECharts](https://echarts.apache.org/en/index.html) library. It supports dynamic field selection, per-slice coloring, and rich chart appearance customization.

---

## ✨ Features

- 🌐 Built with [Apache ECharts](https://echarts.apache.org/)
- 📊 Nightingale/Rose-type pie chart with `radius` and `area` modes
- 🎯 Dynamically choose X (label) and Y (value) fields
- 🎨 Set individual slice colors using `fieldColorMap` (JSON)
- 🎨 Apply a global color to all slices using `fieldColor`
- 📝 Custom chart title, font size, font weight, and title color
- 🧭 Customizable pie radius: `innerRadius` and `outerRadius`
- 🧩 Label customization: font color, size, position (`inside`, `outside`, `center`)
- 📦 Tooltip customization with format template (`{b}: {c} ({d}%)`)
- 🧰 Toolbox with download, reset, and data view options
- 🔍 Optional chart entry animation toggle
- 📜 Toggle chart legend visibility
- ⚡ Built for Grafana 9+

---

## 📦 Installation

### From Source

```bash
git clone https://github.com/VIjayPrasadWebdev/Grafana-panel-using-E-charts.git
cd Grafana-panel-using-E-charts
yarn install
yarn build
