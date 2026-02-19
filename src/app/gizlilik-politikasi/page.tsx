import { Shield } from "lucide-react";

export default function GizlilikPolitikasiPage() {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-bold">Gizlilik Politikası</h1>
      </div>

      <p className="text-xs text-muted-foreground">
        Son güncelleme: 19 Şubat 2026
      </p>

      <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-2 font-semibold text-foreground">1. Genel Bakış</h2>
          <p>
            Oruç Arkadaşım (&quot;Uygulama&quot;), Ramazan ayında kullanıcılara
            namaz vakitleri, imsakiye, kıble yönü, tesbih sayacı ve günlük
            içerik sunan ücretsiz bir mobil uygulamadır. Gizliliğinize saygı
            duyuyor ve kişisel verilerinizi korumayı taahhüt ediyoruz.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">
            2. Toplanan Veriler
          </h2>
          <p className="mb-2">
            Uygulama, aşağıdaki verileri <strong>yalnızca cihazınızda</strong>{" "}
            işler ve herhangi bir sunucuya göndermez:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Konum bilgisi:</strong> Namaz vakitlerini ve kıble yönünü
              hesaplamak için kullanılır. Konum verisi yalnızca cihazınızda
              (localStorage) saklanır ve hiçbir sunucuya iletilmez.
            </li>
            <li>
              <strong>Cihaz yönü (pusula):</strong> Kıble pusulası özelliği için
              cihazın yön sensörü kullanılır. Bu veri kaydedilmez.
            </li>
            <li>
              <strong>Bildirim tercihleri:</strong> İmsak, iftar ve namaz
              bildirimleri için tercihleriniz cihazınızda saklanır.
            </li>
            <li>
              <strong>Tesbih sayacı:</strong> Sayaç verileri yalnızca
              cihazınızda (localStorage) saklanır.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">
            3. Üçüncü Taraf Hizmetler
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Aladhan API:</strong> İlçe bazlı namaz vakitlerini
              hesaplamak için Aladhan API&apos;sine koordinat bilgisi gönderilir.
              Kişisel bilgi paylaşılmaz.
            </li>
            <li>
              <strong>Google AdSense / AdMob:</strong> Uygulama, reklam gösterimi
              için Google reklam hizmetlerini kullanır. Google, reklam
              kişiselleştirme amacıyla cihaz tanımlayıcıları ve kullanım
              verilerini toplayabilir. Detaylar için{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Google Gizlilik Politikası
              </a>
              &apos;nı inceleyebilirsiniz.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">
            4. Veri Saklama
          </h2>
          <p>
            Tüm kullanıcı tercihleri ve verileri yalnızca cihazınızın yerel
            depolama alanında (localStorage) saklanır. Tarayıcı verilerinizi
            veya uygulama verilerinizi temizlediğinizde bu bilgiler silinir.
            Sunucularımızda hiçbir kişisel veri saklanmaz.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">5. İzinler</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Konum:</strong> Namaz vakitleri ve kıble yönü hesaplaması
              (isteğe bağlı, manuel seçim de mümkün)
            </li>
            <li>
              <strong>Bildirim:</strong> İmsak, iftar ve namaz vakti
              hatırlatmaları (isteğe bağlı)
            </li>
            <li>
              <strong>Titreşim:</strong> Tesbih sayacında dokunma geri bildirimi
            </li>
            <li>
              <strong>İnternet:</strong> İlçe namaz vakitleri ve reklam
              gösterimi
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">
            6. Çocukların Gizliliği
          </h2>
          <p>
            Uygulama, 13 yaş altı çocuklardan bilerek kişisel veri toplamaz.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">
            7. Değişiklikler
          </h2>
          <p>
            Bu gizlilik politikası zaman zaman güncellenebilir. Önemli
            değişikliklerde uygulama içi bildirim yapılacaktır.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">8. İletişim</h2>
          <p>
            Gizlilik politikası hakkında sorularınız için:{" "}
            <a
              href="https://github.com/mbugc/orucarkadasim/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              GitHub Issues
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
