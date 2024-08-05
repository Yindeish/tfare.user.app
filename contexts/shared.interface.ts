interface IRequestData {
    email: string,
    password: string,
}

interface IResponseData {
    code: number | null,
    msg: string,
}

interface IContextState extends IResponseData {
}

// interfaces
export { IRequestData, IResponseData, IContextState }