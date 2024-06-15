import UnauthorizedError from '../erros/UnauthorizedError';
import AccountsRepository from '../repositories/AccountRepository';
import PasswordHasher from '../utils/Hasher';
import AuthToken from '../utils/AuthToken';
import Name from '../../domain/Name';
import Email from '../../domain/Email';

export default class AuthenticateUseCase {
  constructor(
    private readonly accountRepository: AccountsRepository,
    private readonly jwtService: AuthToken,
    private readonly passwordHasher: PasswordHasher
  ) {}

  async execute(email: string, password: string): Promise<Output> {
    const accountData = await this.accountRepository.findByEmail(email);
    if (!accountData) throw new UnauthorizedError('Invalid Credentials');
    const encryptPassword = String(accountData.password);
    const passwordMatches = this.passwordHasher.comparePassword(
      password,
      encryptPassword
    );
    if (!passwordMatches) throw new UnauthorizedError('Invalid Credentials');
    const token = this.jwtService.generateToken({
      accountId: accountData.accountId,
      email: accountData.email,
    });

    return {
      account: {
        accountId: accountData.accountId,
        email: accountData.email,
        name: accountData.name,
      },
      token,
    };
  }
}

type Output = {
  account: {
    accountId: string;
    name: Name;
    email: Email;
  };
  token: string;
};
