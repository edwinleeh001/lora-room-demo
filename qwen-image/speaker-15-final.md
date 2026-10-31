# Qwen-Image｜15页公式版中英对照讲稿

15页合并公式版：每段英文后接完整中文翻译。已移除数学互动实验，保留公式原理和算例；30秒配乐视频保留。现场选择一种语言讲述，操作提示不朗读。逐页预算合计17分55秒，低于20分钟上限，留2分05秒缓冲；实际语速仍需计时排练。

## 第01页｜为什么这篇论文值得读？Why this paper?

时间：0:00–0:35；上限35秒

**English**

Today I will discuss Qwen-Image. A beautiful poster can still fail if its text is wrong. An edit can also fail if it changes the background unnecessarily. The paper targets accurate text and consistent editing. I will explain the mechanism, examine its results, and discuss what remains unproven.

**中文翻译**

今天我介绍Qwen-Image。海报即使漂亮，文字错误也会导致任务失败；编辑时不必要地改变背景，同样属于失败。论文聚焦准确文字与一致编辑。我将介绍机制、分析结果，并讨论尚未证明的问题。

## 第02页｜先看整体，再看细节。

时间：0:35–1:20；上限45秒

**English**

This diagram gives the overall route. The language model understands the request. The VAE represents the image compactly. The diffusion Transformer predicts changes in latent space, and the decoder returns pixels. Editing adds two source-image conditions. This is an AI-generated conceptual illustration; we will check the original architecture next.

**中文翻译**

这张图展示整体路径：语言模型理解要求，VAE紧凑地表示图像，扩散Transformer预测潜在空间中的变化，解码器还原像素。编辑时增加两种源图条件。这是AI生成的概念示意；接下来核对原论文架构。

## 第03页｜整体架构：三个组件The system in three components

时间：1:20–2:30；上限70秒

**English**

The original figure separates three roles. Qwen2.5-VL provides semantic conditions. The VAE encodes and reconstructs images. MMDiT predicts latent velocity; its backbone has twenty billion parameters. During training, a clean image defines supervision. During inference, that target is unavailable: generation begins with noise. The next video traces the full process.

**中文翻译**

原图区分三个角色：Qwen2.5-VL提供语义条件，VAE编码和重建图像，MMDiT预测潜在速度，其主干有两百亿参数。训练时，干净图像用于定义监督信号；推理时无法获得这个目标，生成从噪声开始。下一段视频展示完整流程。

## 第04页｜30秒，看懂核心路径。

时间：2:30–3:05；上限35秒

**提示（不朗读）：** 不朗读：播放30秒背景音乐动态图解，本页预算35秒。 / Do not read aloud: play the 30-second music-backed animation; budget 35 seconds.

**English**

Play the 30-second video with background music and the chosen subtitles. There is no narration. Continue when it finishes.

**中文翻译**

选择所需字幕，播放30秒背景音乐动态图解；没有旁白。结束后进入下一页。

## 第05页｜数据、渐进训练与VAEData, progressive training and the VAE

时间：3:05–4:25；上限80秒

**English**

Text-rich data and controlled text rendering provide accurate examples. Progressive training raises text difficulty and resolution. The VAE must also preserve small strokes: its encoder is frozen and its image decoder is tuned. Text reconstruction PSNR rises from twenty-six point seven-seven to thirty-six point six-three decibels. This measures reconstruction, not prompted-text accuracy. The final results reflect the combined data, representation and training choices, not proof of each independent contribution.

**中文翻译**

富文字数据与受控文字渲染提供准确样本，渐进训练逐步提高文字难度和分辨率。VAE也必须保留细小笔画：编码器保持冻结，图像解码器进行微调。文字重建PSNR从26.77提高到36.63分贝。这衡量重建质量，不是提示词文字准确率。最终结果反映数据、表示与训练的共同作用，而不是每项独立贡献的证明。

## 第06页｜Flow matching：公式、算例与推理Flow matching: formula, example and inference

时间：4:25–6:30；上限125秒

**提示（不朗读）：** 依次讲插值、导数、损失和算例；配图为可展开的概念辅助，无需操作实验。 / Explain interpolation, derivative, loss and example; the optional conceptual illustration is not an experiment.

**English**

Here, x zero is clean latent and x one is noise. Interpolation is t times x zero plus one minus t times x one, so time zero is noise and time one is clean. Differentiation gives target velocity x zero minus x one. Training minimizes squared velocity error.

**中文翻译**

这里x₀是干净latent，x₁是噪声。插值为t乘x₀，加上1减t再乘x₁，所以时间0为噪声，时间1为干净端。求导得到目标速度x₀减x₁。训练最小化速度预测的平方误差。

**English**

For clean value two, noise minus one and time one quarter, the position is minus one quarter and target velocity is three. Predicting two and a half gives loss one quarter. These are illustrative scalar values. Inference does not know the clean endpoint; it integrates the learned, changing field from noise. The displayed Euler step explains one numerical update, not the paper’s full sampler.

**中文翻译**

取干净值2、噪声−1、时间四分之一，位置为负四分之一，目标速度为3；预测二点五时，损失为四分之一。这些是一维教学数值。推理不知道干净终点，而是从噪声出发，对学习到的变化速度场积分。展示的欧拉公式解释一步数值更新，并不是论文完整采样器。

## 第07页｜编辑：语义与细节两条路径Editing: meaning and detail

时间：6:30–7:50；上限80秒

**English**

Editing uses two representations of the same source. The VLM route interprets meaning and the requested change; the VAE route supplies visual detail. Both condition one generator. They do not create two pictures for compositing. Source conditioning also differs from the noised target used in training. The architecture motivates complementarity, but ablations must test each route’s contribution.

**中文翻译**

编辑使用同一源图的两种表示：VLM路径理解语义和修改要求，VAE路径提供视觉细节，两者为同一个生成器提供条件，并非各生成一张图片再拼接。源图条件也不同于训练时加噪的目标图。架构说明了互补动机，但每条路径的贡献仍需消融检验。

## 第08页｜后训练：SFT、DPO、GRPOPost-training: SFT, DPO and GRPO

时间：7:50–9:10；上限80秒

**English**

SFT uses high-quality examples; DPO uses preferred and rejected outputs with a reference model. GRPO compares rewards within a prompt group. Its relative advantage is reward minus group mean, divided by group standard deviation. For rewards two, four and six, the mean is four. This example uses population standard deviation. Equal rewards give zero variance, making direct normalization undefined. Positive advantage means above the group average, not necessarily high absolute quality. Full GRPO also includes clipping and KL regularization.

**中文翻译**

SFT使用高质量样本，DPO结合参考模型使用较优与较差输出。GRPO在同一提示词的候选组内比较奖励，相对优势为奖励减组均值，再除以组内标准差。奖励2、4、6的均值为4；这里的算例采用总体标准差。奖励全部相同时方差为0，直接归一化没有定义。正优势只表示高于组均值，不代表绝对质量一定很好。完整GRPO还包含裁剪与KL正则。

## 第09页｜先问评测什么，再看分数Read the evaluation protocol first

时间：9:10–10:00；上限50秒

**English**

Before reading scores, check the task, model version and evaluator. Prompt following, text accuracy and editing measure different properties. The reported Arena comparison excludes Chinese-text prompts. GEdit uses GPT-four-point-one as judge. Each protocol therefore limits what we can conclude.

**中文翻译**

阅读分数前，先核对任务、模型版本和评委。提示遵循、文字准确性和编辑衡量不同属性。报告中的Arena比较排除中文文字提示词，GEdit则使用GPT-4.1作评委。因此，每种协议都限定了能够得出的结论。

## 第10页｜通用生成：优势与小分差General generation: strengths and small margins

时间：10:00–11:10；上限70秒

**English**

DPG reports eighty-eight point three-two for Qwen and eighty-eight point two-seven for Seedream. This small numerical lead does not establish statistical significance. GenEval reports zero point eight-seven for the base model and zero point nine-one for the RL variant. Keep these versions separate; improvement on one benchmark does not imply improvement everywhere.

**中文翻译**

DPG中Qwen为88.32，Seedream为88.27；这个小幅数值领先不能证明统计显著。GenEval中基础版为0.87，RL版本为0.91。比较时应区分版本，不能因为一个基准提升就认为所有任务都提升。

## 第11页｜文字结果：中文强，仍有边界Text results: strong Chinese, clear boundaries

时间：11:10–12:35；上限85秒

**English**

ChineseWord shows the main boundary: level-one accuracy is about ninety-seven percent, but level three is only six point four-eight percent. Common characters are much easier than rare ones. LongText is language-dependent: Qwen leads the listed Chinese comparison, while GPT Image one scores higher on English. Strong Chinese results do not establish universal text reliability.

**中文翻译**

ChineseWord显示了主要边界：第一级准确率约97%，第三级却只有6.48%，常见字明显比罕见字容易。LongText的结果也依赖语言：Qwen在表列中文比较中领先，GPT Image 1的英文分数更高。较强的中文结果并不证明文字生成普遍可靠。

## 第12页｜编辑结果：修改与保留都要测Editing results: change and preservation

时间：12:35–14:15；上限100秒

**English**

English GEdit gives Qwen seven point five-six and GPT Image one seven point five-three. Interpret this small margin cautiously. Overall averages the geometric mean of semantic consistency and perceptual quality for each sample.

**中文翻译**

英文GEdit中，Qwen为7.56，GPT Image 1为7.53，应谨慎解释这个小差距。overall先对每个样本计算语义一致性与感知质量的几何均值，再取平均。

**English**

For samples nine-and-one and one-and-nine, both geometric means are three, so their average is three. Averaging the components first instead gives five. The calculation order matters. In the original Hope-to-Qwen example, inspect both changed lettering and the surrounding content. Selected examples illustrate behaviour, not the overall failure rate.

**中文翻译**

样本9和1、1和9的几何均值都是3，因此平均后为3；先平均分量则得到5。计算顺序很重要。在原论文Hope改成Qwen的例子中，要同时检查修改文字与周围保留内容。精选案例说明行为，不能代表总体失败率。

## 第13页｜批判：哪些结论还不能下？Critique: what remains unproven?

时间：14:15–15:35；上限80秒

**English**

My main concern is attribution: several system components change together. Useful VAE and RL comparisons exist, but they do not isolate every component under matched conditions. Reliability is another concern: rare characters remain difficult, and small margins with model judges limit broad claims. Limited data and compute disclosure also restricts full reproduction. These qualify the results without dismissing the contribution.

**中文翻译**

我的主要关注点是归因：多个系统组件同时变化。论文有有价值的VAE与RL比较，但没有在匹配条件下隔离所有组件。可靠性也是问题：罕见字仍困难，小分差与模型评委限制了宽泛结论。数据与算力披露有限，也限制完整复现。这些因素限定结果，却不否定贡献。

## 第14页｜下一步：控制变量的双路消融Next step: a controlled editing ablation

时间：15:35–16:55；上限80秒

**English**

I propose comparing semantic-only, VAE-only and dual-conditioned editing. Match the data, backbone, training steps and inference budget. Measure requested changes and preservation separately. Repeat across seeds and add independent human evaluation. This proposed experiment would test whether the two routes are complementary. It is a follow-up suggestion, not a completed result in the paper.

**中文翻译**

我建议比较仅语义、仅VAE和双路条件编辑，匹配数据、主干、训练步数与推理预算，分别衡量要求的修改与内容保留。使用多个随机种子，并加入独立人工评价。这个建议实验能够检验两条路径是否互补；它是后续研究建议，不是论文已经完成的结果。

## 第15页｜三个结论，进入问答Three takeaways; then discussion

时间：16:55–17:55；上限60秒

**English**

Three takeaways: text accuracy needs data, representation and training together; dual conditioning targets meaning and detail; and benchmark claims depend on language and protocol. Qwen-Image makes useful progress, but attribution and rare-character reliability need further work. Thank you. I welcome questions about the mathematics, evidence or proposed experiment.

**中文翻译**

三个要点：文字准确性需要数据、表示与训练配合；双路条件针对语义与细节；基准结论取决于语言和协议。Qwen-Image取得了有价值的进展，但归因和罕见字可靠性仍需研究。谢谢，欢迎就数学原理、证据或建议实验提问。
