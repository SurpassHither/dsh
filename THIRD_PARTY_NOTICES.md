# Third-Party Notices

This package distributes the following third-party components. The full dependency tree
is under `payload/app/node_modules` (each package carries its own LICENSE) and in
`sbom.spdx.json`.

## 1. DeepSeek Harness (DSH)

- Package: `@deepseek-ai/dsh` (and its `@deepseek-ai/dsh-*` subpackages)
- Source: <https://github.com/deepseek-ai/deepseek-harness>
- License: MIT, Copyright (c) 2026 DeepSeek

```
MIT License

Copyright (c) 2026 DeepSeek

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 2. Node.js

- Version: see `payload/BUILD-INFO.txt` (official Linux x64 build, v24 LTS)
- Source: <https://github.com/nodejs/node>
- License: MIT (plus bundled third-party components whose licenses ship with the Node release)
- This package distributes **only** the `bin/node` executable and its license notices; it
  does not include npm or header files

## 3. @he0119/dsh-tailnet-admin

- Source: <https://github.com/he0119/dsh-tailnet-admin>
- License: MIT
- Purpose: marks pages reached through the reverse proxy as "local" and disables DSH's
  browser session check; runs only as a DSH profile plugin and does not modify DSH itself

## 4. Local voice: sherpa-onnx + SenseVoiceSmall + Silero VAD

- **sherpa-onnx** (including `sherpa-onnx-node` and the `sherpa-onnx-linux-x64` native package)
  - Source: <https://github.com/k2-fsa/sherpa-onnx>
  - License: Apache-2.0
  - Purpose: run ONNX speech recognition on the NAS itself, offline, without uploading audio
- **SenseVoiceSmall** (`model.int8.onnx` / `tokens.txt`)
  - Source: <https://huggingface.co/csukuangfj/sherpa-onnx-sense-voice-zh-en-ja-ko-yue-2024-07-17>
  - Model card: <https://github.com/FunAudioLLM/SenseVoice>
  - License: Apache-2.0 (model card)
  - Distribution: `tokens.txt` ships with the package; the 239 MB `model.int8.onnx` is
    downloaded by DSH on first use — no model weights are bundled
- **Silero VAD** (`silero_vad.onnx`)
  - Source: <https://github.com/snakers4/silero-vad>
  - License: MIT
  - Distribution: ships with the package (about 1.8 MB) to split silence from speech

## 5. Other npm dependencies

All other packages in `payload/app/node_modules` are production dependencies of DSH; see
their own `LICENSE` / `LICENSE.md` / `package.json` `license` field. They are mostly MIT,
Apache-2.0, BSD-2-Clause, BSD-3-Clause and ISC; packages related to image processing,
terminals and document parsing (such as `sharp`, `node-pty`, `pdfjs`) are distributed
under their own licenses.

This package makes **no modifications** to any third-party code (Node and dsh are both
official builds/releases).

## 6. Optional / on-demand components

- `@deepseek-ai/libreoffice-kit-wasm` (Office document preview): installed on demand with
  `install-office-preview.sh` as described in the README
- SenseVoice `model.int8.onnx`: not bundled; downloaded by DSH on first voice use

## 7. Trademarks

See `NOTICE` in the same directory. DeepSeek / DeepSeek Harness are trademarks of
DeepSeek; TerraMaster / TOS are trademarks of TerraMaster. This app is a community
package and not an official product of either party.
