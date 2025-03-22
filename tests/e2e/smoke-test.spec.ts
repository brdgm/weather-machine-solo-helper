import { test, expect } from '@playwright/test'

test('smoke test', async ({ page }) => {
  await page.goto('/')

  // app home
  await expect(page.locator('h1')).toHaveText('Weather Machine Solo Helper')
  await page.getByRole('link', { name: 'Play Game' }).click()

  // setup game
  await page.getByRole('link', { name: 'Setup Game' }).click()
  await page.getByRole('button', { name: 'Start Game' }).click()

  // play a few turns
  await page.getByRole('link', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'A &' }).first().click()

  // abort game
  await page.getByRole('button', { name: 'Abort Game' }).click()
  await page.locator('#endGameModal').getByRole('button', { name: 'Abort Game' }).click()

  // app home
  await expect(page.locator('h1')).toHaveText('Weather Machine Solo Helper')
})
