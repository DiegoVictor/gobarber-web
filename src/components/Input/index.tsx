import React, {
  InputHTMLAttributes,
  useRef,
  useState,
  useCallback,
} from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { IconType } from 'react-icons/lib';

import { Container, Error } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  icon?: IconType;
  containerStyle?: { [key: string]: string | number | undefined | boolean };
  error?: string | null;
}

const Input: React.FC<InputProps> = ({
  name,
  icon: Icon,
  containerStyle,
  error,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    if (inputRef.current) {
      setIsFilled(inputRef.current.value.length > 0);
    }
  }, [inputRef]);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  return (
    <Container
      style={containerStyle}
      $isErrored={!!error}
      $isFocused={isFocused}
      $isFilled={isFilled}
      data-testid="input-container"
    >
      {Icon && <Icon size={20} />}
      <input
        name={name}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        type="text"
        ref={inputRef}
        {...props}
      />
      {error && (
        <Error title={error}>
          <FiAlertCircle size={20} color="#C53030" />
        </Error>
      )}
    </Container>
  );
};

Input.defaultProps = {
  icon: undefined,
  containerStyle: {},
  error: null,
};

export default Input;
