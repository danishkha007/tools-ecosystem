import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface AmortizationRow {
  paymentNumber: number;
  paymentDate: Date | null;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

@Component({
  selector: 'app-loan-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DecimalPipe],
  templateUrl: './loan-calculator.html',
  styleUrl: './loan-calculator.scss',
})
export class LoanCalculatorComponent {
  loanAmount = 250000;
  annualInterestRate = 6.5;
  loanTermYears = 30;
  extraMonthlyPayment = 0;
  startDate = '';
  currencyCode = 'USD';
  showResults = false;
  errorMessage = '';

  monthlyPayment = 0;
  totalPayment = 0;
  totalInterest = 0;
  scheduledPayments = 0;
  interestSaved = 0;
  timeSavedMonths = 0;
  payoffDate: Date | null = null;
  amortizationSchedule: AmortizationRow[] = [];

  calculate(): void {
    this.errorMessage = '';
    this.showResults = false;

    if (!this.isValidInput()) {
      this.errorMessage = 'Enter a loan amount and term greater than zero, with an interest rate of 0% or more.';
      return;
    }

    const monthlyRate = this.annualInterestRate / 100 / 12;
    const numberOfPayments = Math.round(this.loanTermYears * 12);
    this.monthlyPayment = monthlyRate === 0
      ? this.loanAmount / numberOfPayments
      : this.loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const standardSchedule = this.createSchedule(this.monthlyPayment, monthlyRate);
    const actualPayment = this.monthlyPayment + this.extraMonthlyPayment;
    this.amortizationSchedule = this.createSchedule(actualPayment, monthlyRate);

    this.scheduledPayments = this.amortizationSchedule.length;
    this.totalPayment = this.amortizationSchedule.reduce((total, row) => total + row.payment, 0);
    this.totalInterest = this.amortizationSchedule.reduce((total, row) => total + row.interest, 0);
    const standardInterest = standardSchedule.reduce((total, row) => total + row.interest, 0);
    this.interestSaved = Math.max(0, standardInterest - this.totalInterest);
    this.timeSavedMonths = Math.max(0, standardSchedule.length - this.scheduledPayments);
    this.payoffDate = this.amortizationSchedule.at(-1)?.paymentDate ?? null;
    this.showResults = true;
  }

  reset(): void {
    this.loanAmount = 250000;
    this.annualInterestRate = 6.5;
    this.loanTermYears = 30;
    this.extraMonthlyPayment = 0;
    this.startDate = '';
    this.currencyCode = 'USD';
    this.showResults = false;
    this.errorMessage = '';
  }

  private isValidInput(): boolean {
    return Number.isFinite(this.loanAmount) && this.loanAmount > 0 &&
      Number.isFinite(this.annualInterestRate) && this.annualInterestRate >= 0 &&
      Number.isFinite(this.loanTermYears) && this.loanTermYears > 0 &&
      Number.isFinite(this.extraMonthlyPayment) && this.extraMonthlyPayment >= 0;
  }

  private createSchedule(monthlyPayment: number, monthlyRate: number): AmortizationRow[] {
    const schedule: AmortizationRow[] = [];
    let balance = this.loanAmount;
    let paymentNumber = 0;
    const maxPayments = 1200;

    while (balance > 0.005 && paymentNumber < maxPayments) {
      paymentNumber++;
      const interest = balance * monthlyRate;
      const payment = Math.min(monthlyPayment, balance + interest);
      const principal = payment - interest;
      balance = Math.max(0, balance - principal);
      schedule.push({
        paymentNumber,
        paymentDate: this.getPaymentDate(paymentNumber),
        payment,
        principal,
        interest,
        balance,
      });
    }
    return schedule;
  }

  private getPaymentDate(paymentNumber: number): Date | null {
    if (!this.startDate) return null;
    const [year, month] = this.startDate.split('-').map(Number);
    if (!year || !month) return null;
    return new Date(year, month - 1 + paymentNumber, 1);
  }
}
