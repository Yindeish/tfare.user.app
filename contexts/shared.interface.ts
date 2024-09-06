interface IRequestData {
    email: string,
    pin: string,
}

interface IResponseData {
    code: number | null,
    msg: string,
}

interface IContextState extends IResponseData {
}

// interfaces
export { IRequestData, IResponseData, IContextState }