<template>
  <h1>{{t('endOfGame.title')}}</h1>

  <p v-html="t('endOfGame.phaseB.title')"></p>
  <ul>
    <li v-html="t('endOfGame.phaseB.completeExperiments')"></li>
    <li class="fw-bold" v-html="t('endOfGame.phaseB.noExtremeWeather')"></li>
    <li v-html="t('endOfGame.phaseB.placeResearchTokens')"></li>
  </ul>

  <p v-html="t('endOfGame.saboteurFinalScoring.title')"></p>
  <ul>
    <li v-html="t('endOfGame.saboteurFinalScoring.targetValue')"></li>
  </ul>

  <p v-html="t('endOfGame.playerFinalScoring.title')"></p>
  <ul>
    <li v-html="t('endOfGame.playerFinalScoring.fundingTracks')"></li>
    <li v-html="t('endOfGame.playerFinalScoring.goalTiles')"></li>
    <li v-html="t('endOfGame.playerFinalScoring.nobelPrize')"></li>
  </ul>

  <p v-html="t('endOfGame.winSummary')"></p>

  <button class="btn btn-secondary btn mt-2 ms-3" data-bs-toggle="modal" data-bs-target="#modalAdditionalQualifications">
    {{t('endOfGame.additionalQualifications.title')}}
  </button>

  <div class="modal" tabindex="-1" id="modalAdditionalQualifications">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">{{t('endOfGame.additionalQualifications.title')}}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" :aria-label="t('action.close')"></button>
        </div>
        <div class="modal-body">
          <div class="accordion" id="accordionCondition">

            <div class="accordion-item" v-for="level of 5" :key="level">
              <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="`#accordionAdditionalQualificationItem${level}`" :aria-controls="`accordionAdditionalQualificationItem${level}`">
                  {{t(`endOfGame.additionalQualifications.level${level}.title`)}}
                </button>
              </h2>
              <div :id="`accordionAdditionalQualificationItem${level}`" class="accordion-collapse collapse" aria-labelledby="headingOne">
                <div class="accordion-body">
                  <ul>
                    <template v-for="condition of 5" :key="condition">
                      <li v-if="t(`endOfGame.additionalQualifications.level${level}.condition${condition}`)"
                          v-html="t(`endOfGame.additionalQualifications.level${level}.condition${condition}`)"></li>
                    </template>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{t('action.close')}}</button>
        </div>
      </div>
    </div>
  </div>

  <FooterButtons endGameButtonType="endGame"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import FooterButtons from '@/components/structure/FooterButtons.vue'

export default defineComponent({
  name: 'EndOfGame',
  components: {
    FooterButtons
  },
  setup() {
    const { t } = useI18n()
    return { t }
  }
})
</script>

<style lang="scss" scoped>
#modalAdditionalQualifications ul {
  list-style: none;
  li {
    text-indent: -1rem;
  }
  li:before {
    content: "»";
    padding-right: 5px;
    color: maroon;
  }
}
</style>