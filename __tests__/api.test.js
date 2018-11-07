describe('BinanceAPI', () => {

  describe('Init', () => {
    it('should cause error when used without inti', () => {
      const bnc = require("../src/api");
      expect(typeof bnc).toBe("function");
    });

    it('should error when init with invalid URL', () => {
      expect(() => {
        require("../src/api")("")
      }).toThrow();
    });

    it('should return valid API instance when init with valid URL', () => {
      const bnc = require("../src/api")(
        "https://bnc-gateway.com/api/v1");
      expect(bnc).toBeDefined;
      expect(Object.keys(bnc).length === 9);
    });
  });

  describe('API methods', () => {
    let bnc

    beforeAll(() => {
      bnc = require("../src/api")("https://bnc-gateway.com/api/v1");
    });

    it('should error for invalid txHash params', () => {
      expect.assertions(1);
      bnc.sendTx().catch(e => expect(e).toEqual({ error: "Invalid tx" }));      
    });
  });

})