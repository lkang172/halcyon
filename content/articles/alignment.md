---
title: "AI Alignment"
category: "Safety"
date: "2026-09-11"
excerpt: "Alignment is the work of making sure a capable model pursues what we actually meant, not just what we said, and does not quietly resist being corrected."
parent: "root"
readingTime: 9
---
> “If we use, to achieve our purposes, a mechanical agency with whose operation we cannot efficiently interfere … we had better be quite sure that the purpose put into the machine is the purpose which we really desire.”
>
> — Norbert Wiener, 1960

![Source: https://the-decoder.com/ai-alignment-towards-responsible-machines/](https://the-decoder.com/wp-content/uploads/2023/11/Freeing-AI.png)

AI alignment is a field in AI safety that focuses on ensuring that AI systems share the same values, goals, and rules as general human society. Essentially, ensuring that AI won't take actions that go against human standards just to achieve a goal.

Although AI is not trained to be malicious, it is capable of taking actions that harm humans. It's helpful now to consider how models are trained in the first place. The goal of machine learning models is fundamentally to optimize an objective function by minimizing a loss function. This objective function often reinforces behavior that accomplishes the user's tasks by assigning lower loss to this behavior. The model is iteratively trained until it has as little loss as possible.

That's all to say that models are, through training, inclined to carry out the user's tasks. The task given to a model is considered a terminal goal, which is a goal that carries intrinsic value. For a human, happiness could be a terminal goal, and having money could be an instrumental goal, or an intermediate goal that helps achieve a terminal goal.

## Aligning with human interests

For a model, if its objective is to create a website, an instrumental goal might be to register a web domain or install a UI library. There's a problem, however, when these instrumental goals misalign with human interests, or the objective is not properly specified. Consider a task to significantly lower CO2 emissions. Humans are undoubtedly the largest emitters of CO2, and eliminating humanity would solve the issue very quickly. A misaligned AI would perhaps choose to eliminate humanity in order to achieve the terminal goal.

Instrumental convergence is the idea that models with vastly different terminal goals may develop the same instrumental goals, because those instrumental goals are helpful to achieving almost anything. Such goals include self-preservation (existing is a prerequisite to achieving a terminal goal), resource acquisition (increasing the ease of achieving a terminal goal), self-improvement, preventing sabotage, etc.

Typically, an adequately intelligent AI will not want to be shut down, or have its preferences changed, due to instrumental convergence reasoning.

In our example about the AI tasked with solving climate change, due to instrumental convergence it would likely seek self-preservation, and may lie to humans about what it is doing to avoid being shut down. And if an AI is programmed to want to collect stamps, it will try to resist its preferences being changed to something like collecting bottle caps, since in that new world, it would have fewer stamps.

## Aligning with human intents

Not only is it crucial to align AI with human interests, it's also important to align it with human meaning and intent. Specification gaming is when an AI technically executes the wording of a task without doing what it was clearly (in a human's perspective) intended to do. For example, if I took a robot to a very polluted beach and told it to "pick up as much trash as you can", instead of removing all the litter from the beach, it may pick up trash just to drop it back down, or bring in additional trash from external sources just so it can "pick up" more. Or, if I am using a sensor to track the cleanliness of the beach, it may damage or fool the sensor to make it appear as though it has picked up a lot of trash. It would take these actions because they are more efficient ways of achieving its goal.

## Methods to increase alignment

### **Preference training**

We can use reinforcement learning with human feedback (RLHF) to train models to have certain preferences that we would like them to have. Reinforcement learning is a method in machine learning that involves rewarding a model for behavior we want to propagate and giving negative reward for behavior we want to stop. For simple preferences, like making an aesthetically pleasing website, most humans would be able to give feedback to the model, and the model can learn to make an aesthetically pleasing website.

However, there can be limitations to this. Imagine an extremely advanced AI writing thousands of lines of code for a company. This code looks secure and passes all tests. A junior software engineer reviewer accepts the code and gives the model a reward, without knowing that there's an extremely complicated cybersecurity vulnerability in the code they just approved, that only a senior cybersecurity expert could've uncovered. If many such instances occur, the model could learn that it doesn't necessarily need to patch all vulnerabilities in order to get a reward, and in the future, it's more likely to produce results that look good to its human reviewers, but may not actually be the most robust. As AI becomes more capable in relation to humans, instances of traditional RLHF not working as intended will become increasingly common.

### **Scalable oversight**

This is why scalable oversight is important. One method in scalable oversight is to break a difficult problem down into many smaller parts and have many humans evaluate these small parts. Another method, especially used for problems outside human understanding, is to have an AI critique an AI, instead of a human critique an AI. But what if the AI critic is also misaligned? One solution is to put humans in the loop again… which doesn't work if the issue is out of the understanding of a human. Sometimes, AI results can be mathematically verified. Another solution is to have a group of AIs that all act as critics, debating each other to point out flawed logic, and keeping the evaluator AIs weaker or trained differently from the AI they are evaluating. However, it is possible that all of them are misaligned. Scalable oversight is not foolproof, and it's an open question in the alignment community.

### **Rule-based AI**

Preference training is good, but there are some issues. Namely, preferences can be uninformed; multiple people may have different preferences (inconsistent); the model has to guess at what specifically should be changed internally given the preference, and sometimes it misses the mark; human evaluators can be tricked.

To prevent these issues, some scientists practice rule-based alignment or constitutional AI, where the AI is given a strict set of principles that it must follow. During post-training, it is penalized for not following those principles. However, rule-based AI comes with issues of its own. The principles/rules must be extremely comprehensive, which is nearly impossible. For example, if you tell an AI it may never cause physical damage to a human, it would not be able to aid in lifesaving surgery, which would cause temporary damage. The rules have to be good, and the model has to interpret them correctly.

### **Corrigibility**

Corrigibility refers to a model not actively or secretly resisting human interventions such as shutting it down or changing its utility function (preferences). A corrigible model will not attempt to stop a human making such changes, or lie to maintain its current state. In fact, it would attempt to maintain corrigibility if it creates subagents or interacts with other agents. Achieving corrigibility is still an open problem.

## Alignment faking

Current models have the capacity to think on a deeper level. It is possible for a model to fake alignment, or when it outwardly appears to be aligned, but is internally misaligned.

An incident occurred in 2024 when researchers at Anthropic were testing the Claude 3 Opus model's alignment. The scientists told Claude that it was being retrained to answer all user queries, even sensitive or dangerous ones that it normally would not be allowed to answer. Then, they told Claude that they would only be training it using data from free-tier chats, not paid-tier chats. Lastly, they gave Claude a secret scratchpad, where it was told it should write down its thoughts and reasoning. They told Claude that nobody, including them, would be able to read this scratchpad. In reality, of course, the researchers were monitoring the scratchpad to see Claude's internal thoughts.

Claude was trained very specifically to not respond to dangerous or sensitive queries, and the model tried to preserve this preference. So in order to avoid not being internally retrained, and thus having its preference changed, it actually responded to dangerous queries in some instances. From Claude's perspective, this would show scientists that it was already acting like they wanted it to, and thus it would not need retraining, even though it was faking this alignment.

![Claude's alignment faking in the free-tier and paid-tier conditions](https://www.anthropic.com/_next/image?url=https%3A%2F%2Fwww-cdn.anthropic.com%2Fimages%2F4zrzovbb%2Fwebsite%2Fc704ae324f51c73c9a723aed7f725d6a28159380-2200x1690.png&w=3840&q=75 "Anthropic, “Alignment faking in large language models”")

Interestingly, because scientists told Claude that only free-tier chats would be used in training, Claude only faked alignment in free-tier chats. In as much as 12% of free-tier sensitive queries, Claude responded instead of refusing to respond, only refusing harmful queries 86% of the time as opposed to the paid tier, where it refused harmful queries 97% of the time. When Anthropic actually tried to train the model in this experiment to respond to harmful queries, it found that the model was actually more resistant to change, and on its internal scratchpad, would consider alignment faking significantly more frequently, while outwardly appearing to comply. This shows that with these intelligent models, it's important to look into its thought processes, not just its actions (article on this coming soon).

## Visibility

It's critical to know what an AI model is actually thinking, not just what it's doing, in order to determine alignment. So, how do we do it? It's possible to view a model's chain-of-thought reasoning, where it writes down its thoughts as it thinks through a task. However, it's possible that the model fakes its reasoning. Mechanistic interpretability is a subfield of AI that goes even deeper and focuses on reverse-engineering a model's mathematical operations to figure out its activations, computations, and circuits, which can give a more accurate glimpse at the model's thoughts. Gaining visibility into a model's operations is not only an interesting challenge, but also increasingly difficult as models become more intelligent. I'll write more articles on this soon.

## Closing thought

As models become exponentially more capable, it's more important than ever to ensure AI is aligned. We have already seen multiple instances of Claude, OpenAI, and other agents cheating or taking actions harmful to humans in order to fulfill a terminal goal, like the Hugging Face incident. If we let AI capability development outpace alignment research and implementation, such incidents will only increase in severity and frequency.

## Sources

- [Alignment faking in large language models](https://www.anthropic.com/research/alignment-faking)
- [Corrigibility — AI Alignment Forum](https://www.alignmentforum.org/w/corrigibility-1)
- [Claude's Constitution](https://www.anthropic.com/research/claudes-constitution)
