import Modal, { ModalProps, ModalFuncProps, ActionButtonProps } from 'antd/lib/modal';
import confirm, { withConfirm } from 'antd/lib/modal/confirm';

export { HookModalProps } from 'antd/lib/modal/useModal/HookModal';
export { ModalProps, ModalFuncProps, ActionButtonProps };

/**
 * Modal.confirm
 * 当onOk是Promise函数时，reject时依然关闭Modal
 */
Modal.confirm = function confirmFn(props: ModalFuncProps) {
  const { onOk: originalOnOk, ...restProps } = props;

  let onOk = originalOnOk;
  if (originalOnOk && !originalOnOk.length) {
    onOk = () => {
      const returnValueOfOnOk = originalOnOk();
      if (returnValueOfOnOk && returnValueOfOnOk.catch) {
        return returnValueOfOnOk.catch(() => {});
      }
      return returnValueOfOnOk;
    };
  }
  return confirm(withConfirm({ ...restProps, onOk }));
};

export default Modal;
