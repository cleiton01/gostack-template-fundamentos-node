import Transaction from '../models/Transaction';
import { throwStatement } from '@babel/types';
import TransactionService from '../services/CreateTransactionService';
import { response } from 'express';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];
  private balance: Balance;
  public requestID:number = 1;

  constructor() {
    this.transactions = [];
    this.balance= { income: 0, outcome: 0, total: 0 };
    this.requestID = 1;
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public setBalance({ title, value, type }:TransactionDTO) {
    if( type == "income"){
      this.balance.income += value;
      this.balance.total += value;
    }else{
      this.balance.outcome += value;
      this.balance.total -= value;
    }
  }

  public getBalance(): Balance {
    return this.balance;
  }

  public create({ title, value, type }: TransactionDTO): Transaction {
    this.requestID +=1;
    console.log(`objeto atual${this.requestID}: ${title} ${value} ${type}`);

    if( type == "outcome" && this.balance.total < value ){
      throw Error('Balance its Not enough');
    }

    const transation = new Transaction({title, value, type});

    this.setBalance({title, value, type});

    this.transactions.push(transation);

    return transation;
  }
}

export default TransactionsRepository;
