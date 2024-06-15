import Account from '../../domain/Account';

import PasswordHasher from '../utils/Hasher';
import ApplicationError from '../erros/ApplicationError';
import AccountsRepository from '../repositories/AccountRepository';
import UserAlreadyExists from '../erros/UserAlreadyExists';

export default class CreateAccountUseCase {
  constructor(
    private readonly accountRepository: AccountsRepository,
    private readonly hashProvider: PasswordHasher
  ) {}

  async execute(input: Input): Promise<void> {
    try {
      const account = Account.create(input.name, input.email, input.password);
      const hashedPassword = await this.hashProvider.hashPassword(
        account.password.value
      );
      const userAlreadyExists = await this.accountRepository.findByEmail(
        input.email
      );
      if (userAlreadyExists) throw new UserAlreadyExists('User already exists');
      const accountWithHashedPassword =
        account.withHashedPassword(hashedPassword);
      await this.accountRepository.create(accountWithHashedPassword);
    } catch (error) {
      if (error instanceof ApplicationError) {
        throw new UserAlreadyExists(error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }
}

type Input = {
  name: string;
  email: string;
  password: string;
};
