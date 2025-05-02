import { submitPrompt } from './submit_prompt.js';
import { resetToInitialState} from "./reset.js";
import { adjustWidth } from './adjust_width.js';
import { toggleDarkMode } from './dark_mode.js';
import { copyResultString } from './submit_prompt.js'
import './events.js';

window.resetToInitialState = resetToInitialState;
window.submitPrompt = submitPrompt;
window.toggleDarkMode = toggleDarkMode;
window.adjustWidth = adjustWidth;
window.copyResultString = copyResultString;