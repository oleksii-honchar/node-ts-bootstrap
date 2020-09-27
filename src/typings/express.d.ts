/**
 * @description - Some properties like `body`, `log` etc. are not
 * known properties of interfaces that come out of the box of the `express` library.
 *
 * ```TS
 * router.get('/api/version', (req, res) => {
 *  res.body = '1.0.0';
 * });
 * ```
 *
 * This will cause a compilation error, thus we make a so called "module augmentation"
 */
declare namespace Express {
  interface Response {
    body: any;
    _headers: import('http').IncomingHttpHeaders;
    template?: string;
    opts?: Object;
    response?: any;
  }

  interface Request {
    logger: any;
  }
}
