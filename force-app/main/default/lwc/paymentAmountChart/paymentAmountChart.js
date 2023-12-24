import { LightningElement, track } from 'lwc';
import chartjs from '@salesforce/resourceUrl/ChartJs';
import { loadScript } from 'lightning/platformResourceLoader';

export default class PaymentAmountChart extends LightningElement {
    @track
    isChartInitialized = false;
    chart;

    config = {
        type: "doughnut",
        data: {
            labels: ["Paid Amount", "Remain Amount"],
            datasets: [{
                backgroundColor: ["#08ABED", "#7F7F7F"],
                data: [100, 200]
            }]
        },
        options: {
            title: {
                display: true,
                text: "Opportunities Payments Stats"
            }
        }
    }

    renderedCallback() {
        if (this.isChartInitialized) {
            return;
        }
        this.isChartInitialized = true;

        Promise.all([
            loadScript(this, chartjs)
        ]).then(() => {
            const ctx = this.template.querySelector('canvas.barChart').getContext('2d');
            let copy = JSON.parse(JSON.stringify(this.config));
            this.chart = new window.Chart(ctx, copy);
        }).catch(error => {
            console.log(`Unable to load chartjs: ${error}`);
        });
    }
}