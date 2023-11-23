import { useRef, useEffect } from 'react';
import './styles/ClueList.css';
import OverflowFade from './OverflowFade';
import ListedClue from './ListedClue';
import { bindMethods } from '../helpers/index';

export default function ClueList({
  crossword,
  orientation,
  selectedClueGroup,
  selectedClue,
  onClueClick,
  cellText,
}) {
  const clueListRef = useRef(null);
  const clueRefs = useRef(new Map());
  useEffect(() => {
    if (clueRefs.current.has(selectedClue)) {
      const node = clueRefs.current.get(selectedClue);
      const parent = clueListRef.current;
      const leeway = 28;
      const nodeBottom = node.offsetTop + node.offsetHeight + leeway;
      const nodeTop = node.offsetTop - leeway;
      if (nodeBottom > parent.scrollTop + parent.clientHeight) {
        parent.scroll({ top: nodeBottom - parent.clientHeight });
      } else if (nodeTop < parent.scrollTop) {
        parent.scroll({ top: nodeTop });
      }
    }
  }, [selectedClue]);

  const { clueGroupsByOrientation, sortedClues } = bindMethods(crossword);
  const clueGroups = clueGroupsByOrientation.get(orientation);
  const clues = sortedClues({ clueGroupSubset: clueGroups });

  return (
    <OverflowFade direction="vertical" ref={clueListRef}>
      <ul
        className="ClueList"
      >
        {clues.map((clue, index) => {
          return (
            <li
              key={index}
              ref={(node) => {
                if (node) {
                  clueRefs.current.set(clue, node);
                } else {
                  clueRefs.current.delete(clue);
                }
              }}
            >
              <ListedClue
                isSelected={clue.clueGroup === selectedClueGroup}
                clue={clue}
                cellText={cellText}
                onClick={() => onClueClick(clue)}
              />
            </li>
          );
        })}
      </ul>
    </OverflowFade>
  );
}
