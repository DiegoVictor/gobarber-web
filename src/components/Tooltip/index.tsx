import React, { PropsWithChildren } from 'react';

import { Container } from './styles';

interface TooltipProps {
  title: string;
  className?: string;
}

const Tooltip: React.FC<PropsWithChildren & TooltipProps> = ({
  title,
  className,
  children,
}) => {
  return (
    <Container className={className}>
      {children}
      <span>{title}</span>
    </Container>
  );
};

Tooltip.defaultProps = {
  className: '',
};

export default Tooltip;
