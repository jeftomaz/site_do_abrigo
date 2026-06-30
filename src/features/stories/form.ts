import type { Story } from './types'

export interface StoryFormValues {
  title: string
  body: string
  dog_id: string
  published_at: string
}

export function emptyStoryFormValues(): StoryFormValues {
  return {
    title: '',
    body: '',
    dog_id: '',
    published_at: new Date().toISOString().slice(0, 10),
  }
}

export function storyToFormValues(story: Story): StoryFormValues {
  return {
    title: story.title,
    body: story.body,
    dog_id: story.dog_id ?? '',
    published_at: story.published_at,
  }
}

export function storyFormValuesToPayload(values: StoryFormValues) {
  return {
    title: values.title.trim(),
    body: values.body.trim(),
    dog_id: values.dog_id || null,
    published_at: values.published_at,
  }
}
