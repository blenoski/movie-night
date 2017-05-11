import styled from 'styled-components'
import { Play as PlayIcon } from '../../icons'

export default styled(PlayIcon)`
  background: rgba(0,0,0,0.1);
  border: 3px solid rgba(255,255,255,0.9);
  border-radius: 50%;
  color: rgba(255,255,255,0.9);
  cursor: pointer;
  height: 80px;
  padding: 4% 0% 0% 7.5%;
  transition: all 0.2s ease-in-out;
  width: 80px;
  &:hover {
    color: rgb(2,117,216);
    background-color: rgba(0,0,0,0.5);
  }
`
