import styled from 'styled-components'

import BaseCell from './BaseCell'

const Header = styled.th`
  height: 17px;
  border: #aaa solid 1px;

  text-align: center;
  text-decoration: none;
  font-family: Tahoma, Arial, sans-serif;
  font-size: 12px;

  @media (max-width: 999px) {
    font-family: Roboto, sans-serif;
    height: 35px;
    font-size: 24px;
  }
  justify-content: center;
  font-weight: 600;
`

export default Header
