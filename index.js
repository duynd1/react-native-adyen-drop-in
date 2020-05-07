import { NativeEventEmitter, NativeModules } from "react-native";

const AdyenDropIn = NativeModules.AdyenDropInPayment;
const EventEmitter = new NativeEventEmitter(AdyenDropIn);
let eventMap = {};
let onPaymentProvideListener;
let onPaymentFailListener;
let onPaymentSubmitListener;
let onPaymentCancelListener;
const addListener = (key, listener) => {
  if (eventMap[key]) {
    return eventMap[key];
  }
  eventMap[key] = listener;
  EventEmitter.addListener(key, listener);
};
export default {
  /**
   * Starting payment process.
   * @returns {*}
   */
  configPayment(publicKey, env) {
    return AdyenDropIn.configPayment(publicKey, env);
  },
  /**
   * list paymentMethods
   *
   * @param {String} encodedToken
   *
   * @returns {*}
   */
  paymentMethods(paymentMethodJson) {
    if (typeof paymentMethodJson === "object") {
      paymentMethodJson = JSON.stringify(paymentMethodJson);
    }
    this._validateParam(paymentMethodJson, "paymentMethods", "string");
    return AdyenDropIn.paymentMethods(paymentMethodJson);
  },
  cardPaymentMethod(
    paymentMethodJson,
    name,
    showHolderField,
    showStoreField,
    buttonTitle
  ) {
    if (typeof paymentMethodJson === "object") {
      paymentMethodJson = JSON.stringify(paymentMethodJson);
    }
    this._validateParam(paymentMethodJson, "cardPaymentMethod", "string");
    showHolderField = showHolderField || false;
    showStoreField = showStoreField || false;
    buttonTitle = buttonTitle || "";
    return AdyenDropIn.cardPaymentMethod(
      paymentMethodJson,
      name,
      showHolderField,
      showStoreField,
      buttonTitle
    );
  },

  /**
   * use card paymentMethod
   * @param paymentMethodJson
   * @returns {*}
   */
  storedCardPaymentMethod(paymentMethodJson, index) {
    if (typeof paymentMethodJson === "object") {
      paymentMethodJson = JSON.stringify(paymentMethodJson);
    }
    this._validateParam(paymentMethodJson, "storedCardPaymentMethod", "string");
    index = index || 0;
    return AdyenDropIn.storedCardPaymentMethod(paymentMethodJson, index);
  },
  contractPaymentMethod(paymentMethodJson, index) {
    if (typeof paymentMethodJson === "object") {
      paymentMethodJson = JSON.stringify(paymentMethodJson);
    }
    this._validateParam(paymentMethodJson, "contractPaymentMethod", "string");
    index = index || 0;
    return AdyenDropIn.contractPaymentMethod(paymentMethodJson, index);
  },
  /**
   * handle Action from payments
   * @param actionJson
   * @returns {*}
   */
  handleAction(actionJson) {
    if (typeof actionJson === "object") {
      actionJson = JSON.stringify(actionJson);
    }
    this._validateParam(actionJson, "handleAction", "string");
    return AdyenDropIn.handleAction(actionJson);
  },
  handlePaymentResult(paymentJson) {
    if (typeof paymentJson === "object") {
      paymentJson = JSON.stringify(paymentJson);
    }
    this._validateParam(paymentJson, "handlePaymentResult", "string");
    return AdyenDropIn.handlePaymentResult(paymentJson);
  },
  encryptCard(cardNumber, expiryMonth, expiryYear, securityCode) {
    return AdyenDropIn.encryptCard(
      cardNumber,
      expiryMonth,
      expiryYear,
      securityCode
    );
  },
  /**
   *  call when need to do more action
   */
  onPaymentProvide(mOnPaymentProvide) {
    this._validateParam(mOnPaymentProvide, "onPaymentProvide", "function");
    onPaymentProvideListener = addListener("onPaymentProvide", e => {
      mOnPaymentProvide(e);
    });
  },
  // /**
  //  * call when cancel a payment
  //  * @param mOnPaymentCancel
  //  */
  // onPaymentCancel(mOnPaymentCancel) {
  //     this._validateParam(
  //         mOnPaymentCancel,
  //         'onPaymentCancel',
  //         'function',
  //     );
  //     onPaymentCancelListener = events.addListener(
  //         'mOnPaymentCancel',
  //         e => {
  //             mOnPaymentCancel(e);
  //         },
  //     );
  // },
  /**
   * call when payment fail
   * @param {mOnError} mOnError
   */
  onPaymentFail(mOnPaymentFail) {
    this._validateParam(mOnPaymentFail, "onPaymentFail", "function");
    if (onPaymentFailListener) {
      EventEmitter.removeListener(onPaymentFailListener);
    }
    onPaymentFailListener = addListener("onPaymentFail", e => {
      mOnPaymentFail(e);
    });
  },
  /**
   * call when payment submit ,send to server do payments
   */
  onPaymentSubmit(mOnPaymentSubmit) {
    this._validateParam(mOnPaymentSubmit, "onPaymentSubmit", "function");
    if (onPaymentSubmitListener) {
      EventEmitter.removeListener(onPaymentSubmitListener);
    }
    onPaymentSubmitListener = addListener("onPaymentSubmit", e => {
      mOnPaymentSubmit(e);
    });
  },

  /**
   * @param {*} param
   * @param {String} methodName
   * @param {String} requiredType
   * @private
   */
  _validateParam(param, methodName, requiredType) {
    if (typeof param !== requiredType) {
      throw new Error(
        `Error: AdyenDropIn.${methodName}() requires a ${
          requiredType === "function" ? "callback function" : requiredType
        } but got a ${typeof param}`
      );
    }
  },
  events: EventEmitter,
  removeListeners() {
    eventMap = {};
    EventEmitter.removeAllListeners('onPaymentSubmit')
    EventEmitter.removeAllListeners('onPaymentFail')
    if (onPaymentProvideListener) {
      EventEmitter.removeListener(onPaymentProvideListener);
    }
    if (onPaymentFailListener) {
      EventEmitter.removeListener(onPaymentFailListener);
    }
    if (onPaymentSubmitListener) {
      EventEmitter.removeListener(onPaymentSubmitListener);
    }
    if (onPaymentCancelListener) {
      EventEmitter.removeListener(onPaymentCancelListener);
    }
  }
};
