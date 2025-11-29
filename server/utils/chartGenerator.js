import { createCanvas } from "canvas";
import Chart from "chart.js/auto";

export const generateBarChart = (labels, values) => {
    const width = 800;
    const height = 450;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [
                {
                    label: "Beneficiaries by District",
                    data: values,
                    backgroundColor: "#1e88e5"
                },
            ],
        },
        options: {
            responsive: false,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: "District-wise Approval Count",
                    color: "#000",
                    font: { size: 18 }
                }
            }
        },
    });

    return canvas.toBuffer("image/png");
};

export const generatePieChart = (labels, values) => {
    const width = 600;
    const height = 450;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
        type: "pie",
        data: {
            labels,
            datasets: [
                {
                    label: "Scheme Category Breakdown",
                    data: values,
                    backgroundColor: [
                        "#ff6384", "#36a2eb", "#ffce56"
                    ]
                }
            ]
        },
        options: {
            responsive: false,
            plugins: {
                title: {
                    display: true,
                    text: "Scheme Category Distribution",
                    color: "#000",
                    font: { size: 18 }
                }
            }
        }
    });

    return canvas.toBuffer("image/png");
};
