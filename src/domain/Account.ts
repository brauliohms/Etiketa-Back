import { randomUUID } from 'crypto';
import Email from './Email';
import Name from './Name';
import Password from './Password';

export default class Account {
  accountId: string;
  name: Name;
  email: Email;
  password: Password;

  constructor(accountId: string, name: Name, email: Email, password: Password) {
    this.accountId = accountId;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  static create(name: string, email: string, password: string) {
    const accountId = randomUUID();
    return new Account(
      accountId,
      new Name(name),
      new Email(email),
      new Password(password)
    );
  }

  static restore(
    accountId: string,
    name: string,
    email: string,
    password: string
  ) {
    return new Account(
      accountId,
      new Name(name),
      new Email(email),
      new Password(password, true)
    );
  }

  withHashedPassword(hashedPassword: string): Account {
    return new Account(
      this.accountId,
      this.name,
      this.email,
      new Password(hashedPassword, true)
    );
  }
}
