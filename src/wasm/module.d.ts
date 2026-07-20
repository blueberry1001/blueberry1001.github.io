declare interface EmscriptenModule {
  ccall(
    ident: string,
    returnType: string | null,
    argTypes: string[],
    args: unknown[]
  ): any;
}

declare function ModuleFactory(): Promise<EmscriptenModule>;

export default ModuleFactory;
