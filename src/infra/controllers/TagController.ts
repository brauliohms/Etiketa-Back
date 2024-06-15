import CreateTagUseCase from '../../application/usecases/CreateTag';
import DeleteTagUseCase from '../../application/usecases/DeleteTag';
import GetAllTagsUseCase from '../../application/usecases/GetAllTags';
import GetTagUseCase from '../../application/usecases/GetTagById';
import UpdateTagUseCase from '../../application/usecases/UpdateTag';
import HttpServer from '../http/HttpServer';
import AuthMiddleware from '../http/middlewares/AuthMiddleware';

export default class TagController {
  constructor(
    private httpServer: HttpServer,
    private createTagUseCase: CreateTagUseCase,
    private getTagUseCase: GetTagUseCase,
    private getAllTagsUseCase: GetAllTagsUseCase,
    private updateTagUseCase: UpdateTagUseCase,
    private deleteTagUseCase: DeleteTagUseCase,
    private authMiddleware: AuthMiddleware
  ) {
    this.httpServer.register(
      'post',
      '/tags',
      async (params: any, body: any) => {
        await this.createTagUseCase.execute(body);
      },
      [this.authMiddleware]
    );
    this.httpServer.register(
      'get',
      '/tags/:id',
      async (params: any, body: any) => {
        const { id } = params;
        return await this.getTagUseCase.execute(id);
      },
      [this.authMiddleware]
    );
    this.httpServer.register(
      'get',
      '/tags',
      async (params: any, body: any) => {
        return await this.getAllTagsUseCase.execute();
      },
      [this.authMiddleware]
    );
    this.httpServer.register(
      'put',
      '/tags/:id',
      async (params: any, body: any) => {
        const { id } = params;
        await this.updateTagUseCase.execute(id, body);
      },
      [this.authMiddleware]
    );
    this.httpServer.register(
      'delete',
      '/tags/:id',
      async (params: any, body: any) => {
        const { id } = params;
        await this.deleteTagUseCase.execute(id);
      },
      [this.authMiddleware]
    );
  }
}
