'use client';

import { useState } from 'react';
import { DeliveryManifest, dispatchOrderWithCourier } from '@/lib/api';

interface ShippingManifestModalProps {
  isOpen: boolean;
  onClose: () => void;
  manifest: DeliveryManifest | null;
  adminKey: string;
  onDispatched?: () => void;
}

export default function ShippingManifestModal({
  isOpen,
  onClose,
  manifest,
  adminKey,
  onDispatched,
}: ShippingManifestModalProps) {
  const [selectedCourier, setSelectedCourier] = useState(
    manifest?.logistics.courierPartner && manifest.logistics.courierPartner !== 'Awaiting Manifest'
      ? manifest.logistics.courierPartner
      : 'Delhivery Express'
  );
  const [customAwb, setCustomAwb] = useState(
    manifest?.logistics.awbNumber && manifest.logistics.awbNumber !== 'PENDING-AWB'
      ? manifest.logistics.awbNumber
      : ''
  );
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  if (!isOpen || !manifest) return null;

  const handleDispatch = async () => {
    setIsDispatching(true);
    setDispatchStatus('Registering AWB with 3PL logistics partner...');
    try {
      const generatedAwb =
        customAwb.trim() ||
        `${selectedCourier.startsWith('Blue') ? 'BLDT' : 'DLHV'}${Math.floor(
          100000000 + Math.random() * 900000000
        )}IN`;

      const trackingUrl = selectedCourier.startsWith('Blue')
        ? `https://www.bluedart.com/tracking/${generatedAwb}`
        : `https://www.delhivery.com/track/package/${generatedAwb}`;

      const res = await dispatchOrderWithCourier(adminKey, manifest.orderNumber, {
        courier_partner: selectedCourier,
        awb_number: generatedAwb,
        tracking_url: trackingUrl,
      });

      if (res.success) {
        setDispatchStatus(`✓ Dispatched via ${selectedCourier}! AWB: ${generatedAwb}`);
        if (onDispatched) onDispatched();
      } else {
        setDispatchStatus(`Failed: ${res.message || 'Error dispatching order.'}`);
      }
    } catch {
      setDispatchStatus('Error communicating with dispatch API.');
    } finally {
      setIsDispatching(false);
    }
  };

  const isCod = manifest.financials.paymentMethod === 'COD';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-surface-container w-full max-w-4xl max-h-[92vh] overflow-y-auto border border-outline-variant/70 shadow-2xl flex flex-col text-on-surface">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-outline-variant/40 flex items-center justify-between bg-surface-container-low shrink-0">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#E6C594] text-2xl">local_shipping</span>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#E6C594] font-bold block">
                3PL Courier Dispatch &amp; Tax Manifest
              </span>
              <h2 className="text-lg sm:text-xl font-serif font-medium text-on-surface">
                Order #{manifest.orderNumber}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high border border-outline-variant text-[11px] font-bold uppercase tracking-wider text-on-surface hover:bg-surface-container-highest transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              <span>Print Slip</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-surface-container cursor-pointer"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6">
          {/* Printable Thermal Packing Slip / Waybill Preview */}
          <div className="bg-white text-zinc-900 border-2 border-zinc-900 p-5 sm:p-6 font-mono text-xs shadow-md">
            {/* Top Bar / Branding */}
            <div className="flex items-start justify-between border-b-2 border-zinc-900 pb-4 mb-4 flex-wrap gap-2">
              <div>
                <span className="text-sm font-black tracking-widest uppercase block font-sans">
                  Thread &amp; Bloom
                </span>
                <span className="text-[10px] text-zinc-600 block">Luxury Living Atelier Direct</span>
                <span className="text-[10px] text-zinc-600 block">GSTIN: {manifest.shipper.gstin}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold block bg-zinc-900 text-white px-2.5 py-0.5 uppercase tracking-widest inline-block mb-1">
                  {manifest.logistics.courierPartner || selectedCourier}
                </span>
                <div className="text-[11px] font-bold tracking-wider">
                  AWB: {manifest.logistics.awbNumber || 'PENDING DISPATCH'}
                </div>
              </div>
            </div>

            {/* Barcode Mock Visual */}
            <div className="py-2 text-center border-b border-zinc-300 mb-4">
              <div className="tracking-[0.4em] font-black text-xl select-none">
                |||||| | |||||||| || |||||| | |||||| |||
              </div>
              <span className="text-[10px] tracking-widest text-zinc-600">
                *{manifest.orderNumber}*
              </span>
            </div>

            {/* Grid: Consignee & Shipper */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-b border-zinc-300 pb-4 mb-4">
              {/* Deliver To (Consignee) */}
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block">
                  DELIVERY DESTINATION (CONSIGNEE):
                </span>
                <p className="font-bold text-sm text-zinc-900">{manifest.consignee.name}</p>
                <p className="text-xs leading-relaxed text-zinc-800">{manifest.consignee.address}</p>
                <p className="font-bold text-zinc-900">
                  {manifest.consignee.city}, {manifest.consignee.state} – {manifest.consignee.pincode}
                </p>
                <p className="text-xs font-bold text-zinc-900">
                  Phone: {manifest.consignee.phone}
                </p>
                {manifest.consignee.deliveryInstructions && (
                  <p className="text-[10px] bg-zinc-100 p-1.5 border border-zinc-300 mt-1 italic text-zinc-700">
                    Note: {manifest.consignee.deliveryInstructions}
                  </p>
                )}
              </div>

              {/* Shipper & Package Specs */}
              <div className="space-y-1 sm:border-l sm:border-zinc-300 sm:pl-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block">
                  SHIPPER / RETURN FACILITY:
                </span>
                <p className="font-bold text-xs">{manifest.shipper.companyName}</p>
                <p className="text-[11px] text-zinc-700">{manifest.shipper.address}</p>
                <p className="text-[11px] text-zinc-700">
                  {manifest.shipper.city}, {manifest.shipper.state} - {manifest.shipper.pincode}
                </p>

                <div className="pt-2 border-t border-zinc-200 mt-2 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-zinc-500 text-[10px] block">DEAD WEIGHT:</span>
                    <span className="font-bold">{manifest.logistics.deadWeightKg} KG</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] block">DIMENSIONS:</span>
                    <span className="font-bold">{manifest.logistics.dimensionsCm} CM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* COD vs Prepaid Cash Collection Box */}
            <div
              className={`p-3 text-center border-2 uppercase font-black tracking-widest text-sm mb-4 ${
                isCod
                  ? 'bg-amber-50 border-amber-600 text-amber-900'
                  : 'bg-emerald-50 border-emerald-600 text-emerald-900'
              }`}
            >
              {isCod ? (
                <div>
                  <span className="block text-xs text-amber-800">
                    CASH ON DELIVERY — COLLECT EXACT AMOUNT AT DOORSTEP
                  </span>
                  <span className="text-xl font-bold">
                    ₹{Number(manifest.financials.codAmountToCollect).toLocaleString('en-IN')}.00
                  </span>
                </div>
              ) : (
                <div>
                  <span className="block text-xs text-emerald-800">
                    PREPAID SHIPMENT — DO NOT COLLECT CASH FROM PATRON
                  </span>
                  <span className="text-base font-bold">VERIFIED ZERO BALANCE DUE</span>
                </div>
              )}
            </div>

            {/* Items Manifest Table */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block mb-1">
                ITEM MANIFEST (HSN 6302 - BED LINEN):
              </span>
              <table className="w-full text-left text-[11px] border border-zinc-300">
                <thead className="bg-zinc-100 border-b border-zinc-300 text-[10px] font-bold">
                  <tr>
                    <th className="p-1.5">SKU / Item</th>
                    <th className="p-1.5">HSN</th>
                    <th className="p-1.5">Size &amp; Color</th>
                    <th className="p-1.5 text-center">Qty</th>
                    <th className="p-1.5 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {manifest.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-1.5 font-bold">
                        {it.name}
                        <span className="block text-[9px] text-zinc-500">{it.sku}</span>
                      </td>
                      <td className="p-1.5">{it.hsn}</td>
                      <td className="p-1.5">
                        {it.size} | {it.color}
                      </td>
                      <td className="p-1.5 text-center font-bold">{it.quantity}</td>
                      <td className="p-1.5 text-right font-bold">
                        ₹{Number(it.totalPrice).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tax Invoice Summary */}
            <div className="mt-3 pt-3 border-t border-zinc-300 flex justify-between items-center text-[10px] text-zinc-600 flex-wrap gap-2">
              <div>
                <span>Taxable Value: ₹{manifest.taxInvoice.taxableValue}</span> |{' '}
                <span>Total GST (12%): ₹{manifest.taxInvoice.totalGst}</span>
              </div>
              <div className="font-bold text-xs text-zinc-900">
                Grand Total: ₹{Number(manifest.financials.totalAmount).toLocaleString('en-IN')}.00
              </div>
            </div>
          </div>

          {/* Logistics Dispatch Controls */}
          <div className="bg-surface-container-low border border-outline-variant/60 p-5 space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-bold text-on-surface-variant flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[#E6C594]">rv_hookup</span>
              3PL Carrier Dispatch Execution
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-on-surface-variant mb-1 font-medium">
                  Select 3PL Logistics Partner
                </label>
                <select
                  value={selectedCourier}
                  onChange={(e) => setSelectedCourier(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant px-3 py-2 text-xs text-on-surface outline-none"
                >
                  <option value="Delhivery Express">Delhivery Express (Surface &amp; Air)</option>
                  <option value="Blue Dart Apex Air">Blue Dart Apex Air (Express Priority)</option>
                  <option value="Shiprocket Air">Shiprocket B2B Air Logistics</option>
                  <option value="Shadowfax Logistics">Shadowfax Same-Day Hyperlocal</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-on-surface-variant mb-1 font-medium">
                  Air Waybill (AWB) Tracking Code
                </label>
                <input
                  type="text"
                  value={customAwb}
                  onChange={(e) => setCustomAwb(e.target.value)}
                  placeholder="Auto-generate or enter 3PL AWB"
                  className="w-full bg-surface-container-lowest border border-outline-variant px-3 py-2 text-xs text-on-surface outline-none font-mono"
                />
              </div>
            </div>

            {dispatchStatus && (
              <div className="p-3 bg-surface-container-lowest border border-[#E6C594]/60 text-xs text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-[#E6C594]">info</span>
                <span>{dispatchStatus}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30 flex-wrap gap-3">
              <span className="text-[11px] text-on-surface-variant">
                Pickup origin: Central Atelier, Indiranagar, Bengaluru
              </span>
              <button
                type="button"
                onClick={handleDispatch}
                disabled={isDispatching}
                className="inline-flex items-center gap-2 bg-[#E6C594] hover:bg-[#d4b07d] text-[#12100E] font-bold text-xs uppercase tracking-[0.2em] px-6 py-2.5 transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isDispatching && (
                  <span className="material-symbols-outlined text-sm animate-spin">
                    progress_activity
                  </span>
                )}
                <span>
                  {isDispatching
                    ? 'Dispatching...'
                    : `Dispatch via ${selectedCourier.split(' ')[0]}`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
