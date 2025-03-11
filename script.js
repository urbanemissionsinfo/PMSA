document.addEventListener("DOMContentLoaded", function () {
    const stateSelect = document.getElementById("state-select");
    const districtSelect = document.getElementById("district-select");
    const pieChartCanvas = document.getElementById("pieChart").getContext("2d");
    let chart;
    let allData = [];

  
    // Load CSV data
    Papa.parse("pmsa_clubbed_district.csv", {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: function (results) {
        allData = results.data;

        // Populate states dropdown
      const states = [...new Set(allData.map((row) => row.stname))];
      states.forEach((state) => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
      });
    },
});
  
  // Handle state selection
  stateSelect.addEventListener("change", function () {
    const selectedState = this.value;
    districtSelect.innerHTML = '<option value="">--Select District--</option>';

    if (selectedState) {
      // Filter districts for the selected state
      const districts = allData
        .filter((row) => row.stname === selectedState)
        .map((row) => row.dtname);

      // Populate districts dropdown
      districts.forEach((district) => {
        const option = document.createElement("option");
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
      });
    }
  });

  // Handle district selection
  districtSelect.addEventListener("change", function () {
    const selectedDistrict = this.value;
    const selectedState = stateSelect.value;

    if (selectedDistrict && selectedState) {
      // Find the selected row
      const selectedData = allData.find(
        (row) => row.stname === selectedState && row.dtname === selectedDistrict
      );

      if (selectedData) {
        updateChart(selectedData);
      }
    }
  });

    // Function to update the pie chart
    function updateChart(data) {
      const chartData = {
        labels: ["DUST", "WINDUST", "WASTE", "RESI", "TRANS", "POWER", "INDUS", "BIOB", "AGR" ,"OTHER"],
        datasets: [
          {
            data: [data.DUST, data.WINDUST, data.WASTE, data.RESI, data.TRANS,
                 data.POWER, data.INDUS, data.BIOB, data.AGR, data.OTHER],
            backgroundColor: [
                "#FF6B6B", // Soft Red (DUST)
                "#4D96FF", // Bright Blue (WINDUST)
                "#FFD166", // Warm Yellow (WASTE)
                "#06D6A0", // Green Teal (RESI)
                "#8338EC", // Vivid Purple (TRANS)
                "#FF9F1C", // Orange (POWER)
                "#A8DADC", // Light Cyan (INDUS)
                "#E63946", // Deep Red (BIOB)
                "#2A9D8F", // Dark Teal (AGR)
                "#8D99AE"  // Muted Gray-Blue (OTHER)
              ],
          },
        ],
      };
  
      if (chart) {
        chart.destroy();
      }
  
      chart = new Chart(pieChartCanvas, {
        type: "pie",
        data: chartData,
        options: {
            layout: {
                padding: 20, // Increase padding to prevent cutoff
              },
          plugins: {
            datalabels: {
              formatter: (value, context) => {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(0); // Round to 0 decimal places
                return `${percentage}%`;
              },
              color: "#000", // Label text color
              font: {
                weight: "bold", // Make labels bold
                size: 14, // Adjust font size
              },
              anchor: "end", // Position labels outside the pie
              align: "end", // Align labels outside the pie
              offset: 0,
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const value = context.raw || 0;
                  const percentage = ((value / total) * 100).toFixed(2); // Round to 2 decimal places
                  return `${context.label}: ${percentage}%`;
                },
              },
            },
            legend: {
                position: "left", // Move legend to the left
                labels: {
                  font: {
                    size: 14, // Adjust legend font size
                  },
                  padding: 10, // Add padding between legend items
                },
              },
            },
          },
          plugins: [ChartDataLabels], // Enable the datalabels plugin
        });
      }
    });
    