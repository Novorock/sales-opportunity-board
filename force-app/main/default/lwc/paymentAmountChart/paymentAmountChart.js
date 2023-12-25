import { LightningElement, track } from 'lwc';
import getPaymentStat from '@salesforce/apex/PaymentStatChartService.getPaymentStat';
import chartjs from '@salesforce/resourceUrl/ChartJs';
import { loadScript } from 'lightning/platformResourceLoader';

export default class PaymentAmountChart extends LightningElement {
    loading = true;
    @track
    isChartInitialized = false;
    chart;
    values = [0, 100];

    renderChart() {
        const config = {
            type: "doughnut",
            data: {
                labels: ["Paid Amount", "Remain Amount"],
                datasets: [{
                    backgroundColor: ["#0070D2", "#C9C9C9"],
                    data: this.values
                }]
            },
            options: {
                title: {
                    display: true,
                    resizeDelay: 3,
                    responsive: false,
                    text: "Opportunities Payments Stats"
                }
            }
        }

        const ctx = this.template.querySelector('canvas.dntChart').getContext('2d');
        this.chart = new window.Chart(ctx, config);
        this.chart.canvas.parentNode.style.max_height = '270px';
        this.chart.canvas.parentNode.style.max_width = '450px';
    }

    renderedCallback() {
        if (this.isChartInitialized) {
            return;
        }
        this.isChartInitialized = true;

        Promise.all([
            loadScript(this, chartjs)
        ]).then(() => {
            getPaymentStat().then((data) => {
                this.values = [];
                this.values.push(data.PaidAmount);
                this.values.push(data.RemainAmount);
                this.renderChart();
            });
        }).catch(error => {
            console.log(`Unable to load chartjs: ${error}`);
        });
    }
}