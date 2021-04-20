javascript: {
	"use strict";

	/**
	 * Given an array of property names, this will produce a window alert listing them for the user.
	 * This list will be copied into the console without truncation.
	 * If the console supports them, features like grouping and other interactive elements are used.
	 *
	 * @param globalProps array of property names
	 * @param error any error that occurred while collecting the list of default properties
	 */
	let processProps = (globalProps, error) => {
		globalProps = Object.getOwnPropertyNames(window).filter(name => !globalProps.includes(name));

		/**
		 * This is a basic compare function for strings.
		 *
		 * @param a first string to compare
		 * @param b second string to compare
		 * @return negative number when <var>a</var> comes before <var>b</var>, positive number when <var>b</var> comes before <var>a</var>, and zero in all other cases
		 */
		let compare = Intl?.Collator ? new Intl.Collator('en', {
			usage: "sort",
			sensitivity: "base",
			numeric: true,
			caseFirst: "upper"
		}).compare : (a, b) => a.localeCompare(b);

		/**
		 * This is a property comparator. Properties are referenced indirectly by name, and they must be properites of <var>window</var>.
		 * Properties that are functions always come before any other type of property; otherwise, properties are sorted by name.
		 *
		 * @param aName name of first global property to compare
		 * @param bName name of second global property to compare
		 */
		let propSorter = (aName, bName) => {
			let a = window[aName];
			let b = window[bName];
			let aFun = a instanceof Function;
			if (aFun == (b instanceof Function)) {
				return compare(a, b);
			} else {
				return aFun ? +1 : -1;
			}
		};
		console.group("custom global properties");
		error && console.warn("A pop-up couldn’t be opened, so usual properties are guessed.");
		if (console.table) {
			console.table(globalProps.sort(propSorter).map(name => {
				let prop = window[name];
				return Object.defineProperties(Object.create(null), {
					name: {
						value: name,
						enumerable: true
					},
					type: {
						value: (prop === null ? "null" : prop === undefined ? "undefined" : Number.isNaN(prop) ? "undefined" : (typeof prop == "function" || prop instanceof Function) ? "function" : (typeof prop == "string" || prop instanceof String) ? "string" : (typeof prop == "number" || prop instanceof Number) ? "number" : (typeof prop == "bigint" || prop instanceof BigInt) ? "bigint" : (typeof prop == "boolean" || prop instanceof Boolean) ? "boolean" : (typeof prop == "symbol" || prop instanceof Symbol) ? "symbol" : (Object.getPrototypeOf(prop)[Symbol.toStringTag] || Object.getPrototypeOf(prop)?.constructor?.name)),
						enumerable: true
					},
					value: {
						get: () => {
							let value = window[name];
							if (value instanceof Object) {
								console.group(`value of window[${name}]`);
								console.dir(value);
								console.groupEnd();
							}
							return value;
						},
						enumerable: true
					},
					"own prop. count": {
						value: (prop === undefined || prop === null) ? NaN : Object.getOwnPropertyNames(prop).length,
						enumerable: true
					},
					"enum. prop. count": {
						get: () => {
							try {
								let count = 0;
								for (let a in prop) {
									count++;
								}
								return count;
							} catch {
								return 0;
							}
						},
						enumerable: true
					}
				});
			}));
		} else if (console.dir) {
			console.dir(new Map(globalProps.sort(propSorter).map(name => [name, window[name]])));
		} else {
			console.log(globalProps.sort(propSorter).map(name => String.fromCodePoint(0x2022, 0x20) + name).join("\n"));
		}
		console.groupEnd();
		{
			let alertMessage = globalProps.length > 0 ? `${globalProps.length} custom global propert${globalProps.length == 1 ? "y" : "ies"}:\n${globalProps.slice(0, 16).map(name => String.fromCodePoint(0x2022, 0x20) + name).join("\n")}` : "no custom global properties";
			if (globalProps.length > 16) { alertMessage += `\n${String.fromCodePoint(0x22EE)}`; }
			window.setTimeout(function() {
				window.alert(alertMessage);
			}, 0);
		}
	};
	let propWind, error;

	// open the pop-up
	try {
		propWind = window.open("", "_blank", "width=100,height=100,menubar=off,toolbar=off,location=off,status=off,resizable=on,scrollbars=off");
	} catch (e) { error = e; }

	if (propWind) {
		try {
			try {
				propWind.document.body.style.setProperty("background", "#000");
			} catch {}

			// read the property names from the pop-up’s <var>window</var>
			let globalProps = Object.getOwnPropertyNames(propWind);
			propWind.close();
			processProps(globalProps);
		} catch (e) {
			error = e;
		} finally {
			if (propWind && !propWind.closed) {
				try {
					propWind.close();
				} catch {}
			}
		}
	}
	if (!propWind || error) {

		// If there’s some sort of error, then this falls back to a default set of properties that correspond to a recent version of Google Chrome.
		processProps(
			"Object Function Array Number parseFloat parseInt Infinity NaN undefined Boolean String Symbol Date Promise RegExp Error EvalError RangeError ReferenceError SyntaxError TypeError URIError globalThis JSON Math console Intl ArrayBuffer Uint8Array Int8Array Uint16Array Int16Array Uint32Array Int32Array Float32Array Float64Array Uint8ClampedArray BigUint64Array BigInt64Array DataView Map BigInt Set WeakMap WeakSet Proxy Reflect decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape eval isFinite isNaN Option Image Audio webkitURL webkitRTCPeerConnection webkitMediaStream WebKitMutationObserver WebKitCSSMatrix XPathResult XPathExpression XPathEvaluator XMLSerializer XMLHttpRequestUpload XMLHttpRequestEventTarget XMLHttpRequest XMLDocument WritableStreamDefaultWriter WritableStream Worker Window WheelEvent WebSocket WebGLVertexArrayObject WebGLUniformLocation WebGLTransformFeedback WebGLTexture WebGLSync WebGLShaderPrecisionFormat WebGLShader WebGLSampler WebGLRenderingContext WebGLRenderbuffer WebGLQuery WebGLProgram WebGLFramebuffer WebGLContextEvent WebGLBuffer WebGLActiveInfo WebGL2RenderingContext WaveShaperNode VisualViewport ValidityState VTTCue UserActivation URLSearchParams URL UIEvent TreeWalker TransitionEvent TransformStream TrackEvent TouchList TouchEvent Touch TimeRanges TextTrackList TextTrackCueList TextTrackCue TextTrack TextMetrics TextEvent TextEncoderStream TextEncoder TextDecoderStream TextDecoder Text TaskAttributionTiming SyncManager SubmitEvent StyleSheetList StyleSheet StylePropertyMapReadOnly StylePropertyMap StorageEvent Storage StereoPannerNode StaticRange ShadowRoot Selection SecurityPolicyViolationEvent ScriptProcessorNode ScreenOrientation Screen SVGViewElement SVGUseElement SVGUnitTypes SVGTransformList SVGTransform SVGTitleElement SVGTextPositioningElement SVGTextPathElement SVGTextElement SVGTextContentElement SVGTSpanElement SVGSymbolElement SVGSwitchElement SVGStyleElement SVGStringList SVGStopElement SVGSetElement SVGScriptElement SVGSVGElement SVGRectElement SVGRect SVGRadialGradientElement SVGPreserveAspectRatio SVGPolylineElement SVGPolygonElement SVGPointList SVGPoint SVGPatternElement SVGPathElement SVGNumberList SVGNumber SVGMetadataElement SVGMatrix SVGMaskElement SVGMarkerElement SVGMPathElement SVGLinearGradientElement SVGLineElement SVGLengthList SVGLength SVGImageElement SVGGraphicsElement SVGGradientElement SVGGeometryElement SVGGElement SVGForeignObjectElement SVGFilterElement SVGFETurbulenceElement SVGFETileElement SVGFESpotLightElement SVGFESpecularLightingElement SVGFEPointLightElement SVGFEOffsetElement SVGFEMorphologyElement SVGFEMergeNodeElement SVGFEMergeElement SVGFEImageElement SVGFEGaussianBlurElement SVGFEFuncRElement SVGFEFuncGElement SVGFEFuncBElement SVGFEFuncAElement SVGFEFloodElement SVGFEDropShadowElement SVGFEDistantLightElement SVGFEDisplacementMapElement SVGFEDiffuseLightingElement SVGFEConvolveMatrixElement SVGFECompositeElement SVGFEComponentTransferElement SVGFEColorMatrixElement SVGFEBlendElement SVGEllipseElement SVGElement SVGDescElement SVGDefsElement SVGComponentTransferFunctionElement SVGClipPathElement SVGCircleElement SVGAnimationElement SVGAnimatedTransformList SVGAnimatedString SVGAnimatedRect SVGAnimatedPreserveAspectRatio SVGAnimatedNumberList SVGAnimatedNumber SVGAnimatedLengthList SVGAnimatedLength SVGAnimatedInteger SVGAnimatedEnumeration SVGAnimatedBoolean SVGAnimatedAngle SVGAnimateTransformElement SVGAnimateMotionElement SVGAnimateElement SVGAngle SVGAElement Response ResizeObserverEntry ResizeObserver Request ReportingObserver ReadableStreamDefaultReader ReadableStream Range RadioNodeList RTCTrackEvent RTCStatsReport RTCSessionDescription RTCSctpTransport RTCRtpTransceiver RTCRtpSender RTCRtpReceiver RTCPeerConnectionIceEvent RTCPeerConnectionIceErrorEvent RTCPeerConnection RTCIceCandidate RTCErrorEvent RTCError RTCEncodedVideoFrame RTCEncodedAudioFrame RTCDtlsTransport RTCDataChannelEvent RTCDataChannel RTCDTMFToneChangeEvent RTCDTMFSender RTCCertificate PromiseRejectionEvent ProgressEvent ProcessingInstruction PopStateEvent PointerEvent PluginArray Plugin PeriodicWave PerformanceTiming PerformanceServerTiming PerformanceResourceTiming PerformancePaintTiming PerformanceObserverEntryList PerformanceObserver PerformanceNavigationTiming PerformanceNavigation PerformanceMeasure PerformanceMark PerformanceLongTaskTiming PerformanceEventTiming PerformanceEntry PerformanceElementTiming Performance Path2D PannerNode PageTransitionEvent OverconstrainedError OscillatorNode OfflineAudioContext OfflineAudioCompletionEvent NodeList NodeIterator NodeFilter Node NetworkInformation Navigator NamedNodeMap MutationRecord MutationObserver MutationEvent MouseEvent MimeTypeArray MimeType MessagePort MessageEvent MessageChannel MediaStreamTrackEvent MediaStreamTrack MediaStreamEvent MediaStreamAudioSourceNode MediaStreamAudioDestinationNode MediaStream MediaRecorder MediaQueryListEvent MediaQueryList MediaList MediaError MediaEncryptedEvent MediaElementAudioSourceNode MediaCapabilities Location LayoutShiftAttribution LayoutShift LargestContentfulPaint KeyframeEffect KeyboardEvent IntersectionObserverEntry IntersectionObserver InputEvent InputDeviceInfo InputDeviceCapabilities ImageData ImageCapture ImageBitmapRenderingContext ImageBitmap IdleDeadline IIRFilterNode IDBVersionChangeEvent IDBTransaction IDBRequest IDBOpenDBRequest IDBObjectStore IDBKeyRange IDBIndex IDBFactory IDBDatabase IDBCursorWithValue IDBCursor History Headers HashChangeEvent HTMLVideoElement HTMLUnknownElement HTMLUListElement HTMLTrackElement HTMLTitleElement HTMLTimeElement HTMLTextAreaElement HTMLTemplateElement HTMLTableSectionElement HTMLTableRowElement HTMLTableElement HTMLTableColElement HTMLTableCellElement HTMLTableCaptionElement HTMLStyleElement HTMLSpanElement HTMLSourceElement HTMLSlotElement HTMLShadowElement HTMLSelectElement HTMLScriptElement HTMLQuoteElement HTMLProgressElement HTMLPreElement HTMLPictureElement HTMLParamElement HTMLParagraphElement HTMLOutputElement HTMLOptionsCollection HTMLOptionElement HTMLOptGroupElement HTMLObjectElement HTMLOListElement HTMLModElement HTMLMeterElement HTMLMetaElement HTMLMenuElement HTMLMediaElement HTMLMarqueeElement HTMLMapElement HTMLLinkElement HTMLLegendElement HTMLLabelElement HTMLLIElement HTMLInputElement HTMLImageElement HTMLIFrameElement HTMLHtmlElement HTMLHeadingElement HTMLHeadElement HTMLHRElement HTMLFrameSetElement HTMLFrameElement HTMLFormElement HTMLFormControlsCollection HTMLFontElement HTMLFieldSetElement HTMLEmbedElement HTMLElement HTMLDocument HTMLDivElement HTMLDirectoryElement HTMLDialogElement HTMLDetailsElement HTMLDataListElement HTMLDataElement HTMLDListElement HTMLContentElement HTMLCollection HTMLCanvasElement HTMLButtonElement HTMLBodyElement HTMLBaseElement HTMLBRElement HTMLAudioElement HTMLAreaElement HTMLAnchorElement HTMLAllCollection GeolocationPositionError GeolocationPosition GeolocationCoordinates Geolocation GamepadHapticActuator GamepadEvent GamepadButton Gamepad GainNode FormDataEvent FormData FontFaceSetLoadEvent FontFace FocusEvent FileReader FileList File FeaturePolicy External EventTarget EventSource Event ErrorEvent ElementInternals Element DynamicsCompressorNode DragEvent DocumentType DocumentFragment Document DelayNode DecompressionStream DataTransferItemList DataTransferItem DataTransfer DOMTokenList DOMStringMap DOMStringList DOMRectReadOnly DOMRectList DOMRect DOMQuad DOMPointReadOnly DOMPoint DOMParser DOMMatrixReadOnly DOMMatrix DOMImplementation DOMException DOMError CustomEvent CustomElementRegistry Crypto CountQueuingStrategy ConvolverNode ConstantSourceNode CompressionStream CompositionEvent Comment CloseEvent ClipboardItem ClipboardEvent CharacterData ChannelSplitterNode ChannelMergerNode CanvasRenderingContext2D CanvasPattern CanvasGradient CanvasCaptureMediaStreamTrack CSSVariableReferenceValue CSSUnparsedValue CSSUnitValue CSSTranslate CSSTransformValue CSSTransformComponent CSSSupportsRule CSSStyleValue CSSStyleSheet CSSStyleRule CSSStyleDeclaration CSSSkewY CSSSkewX CSSSkew CSSScale CSSRuleList CSSRule CSSRotate CSSPositionValue CSSPerspective CSSPageRule CSSNumericValue CSSNumericArray CSSNamespaceRule CSSMediaRule CSSMatrixComponent CSSMathValue CSSMathSum CSSMathProduct CSSMathNegate CSSMathMin CSSMathMax CSSMathInvert CSSKeywordValue CSSKeyframesRule CSSKeyframeRule CSSImportRule CSSImageValue CSSGroupingRule CSSFontFaceRule CSSConditionRule CSS CDATASection ByteLengthQueuingStrategy BroadcastChannel BlobEvent Blob BiquadFilterNode BeforeUnloadEvent BeforeInstallPromptEvent BatteryManager BaseAudioContext BarProp AudioWorkletNode AudioScheduledSourceNode AudioProcessingEvent AudioParamMap AudioParam AudioNode AudioListener AudioDestinationNode AudioContext AudioBufferSourceNode AudioBuffer Attr AnimationEvent AnimationEffect Animation AnalyserNode AbortSignal AbortController window self document name location customElements history locationbar menubar personalbar scrollbars statusbar toolbar status closed frames length top opener parent frameElement navigator origin external screen innerWidth innerHeight scrollX pageXOffset scrollY pageYOffset visualViewport screenX screenY outerWidth outerHeight devicePixelRatio event clientInformation offscreenBuffering screenLeft screenTop defaultStatus defaultstatus styleMedia onsearch isSecureContext performance onappinstalled onbeforeinstallprompt crypto indexedDB webkitStorageInfo sessionStorage localStorage onabort onblur oncancel oncanplay oncanplaythrough onchange onclick onclose oncontextmenu oncuechange ondblclick ondrag ondragend ondragenter ondragleave ondragover ondragstart ondrop ondurationchange onemptied onended onerror onfocus onformdata oninput oninvalid onkeydown onkeypress onkeyup onload onloadeddata onloadedmetadata onloadstart onmousedown onmouseenter onmouseleave onmousemove onmouseout onmouseover onmouseup onmousewheel onpause onplay onplaying onprogress onratechange onreset onresize onscroll onseeked onseeking onselect onstalled onsubmit onsuspend ontimeupdate ontoggle onvolumechange onwaiting onwebkitanimationend onwebkitanimationiteration onwebkitanimationstart onwebkittransitionend onwheel onauxclick ongotpointercapture onlostpointercapture onpointerdown onpointermove onpointerup onpointercancel onpointerover onpointerout onpointerenter onpointerleave onselectstart onselectionchange onanimationend onanimationiteration onanimationstart ontransitionrun ontransitionstart ontransitionend ontransitioncancel onafterprint onbeforeprint onbeforeunload onhashchange onlanguagechange onmessage onmessageerror onoffline ononline onpagehide onpageshow onpopstate onrejectionhandled onstorage onunhandledrejection onunload alert atob blur btoa cancelAnimationFrame cancelIdleCallback captureEvents clearInterval clearTimeout close confirm createImageBitmap fetch find focus getComputedStyle getSelection matchMedia moveBy moveTo open postMessage print prompt queueMicrotask releaseEvents requestAnimationFrame requestIdleCallback resizeBy resizeTo scroll scrollBy scrollTo setInterval setTimeout stop webkitCancelAnimationFrame webkitRequestAnimationFrame SharedArrayBuffer Atomics AggregateError FinalizationRegistry WeakRef chrome WebAssembly portalHost onportalactivate launchQueue onscreenschange caches ondevicemotion ondeviceorientation ondeviceorientationabsolute scheduler originAgentCluster cookieStore nativeIO USB USBAlternateInterface USBConfiguration USBConnectionEvent USBDevice USBEndpoint USBInTransferResult USBInterface USBIsochronousInTransferPacket USBIsochronousInTransferResult USBIsochronousOutTransferPacket USBIsochronousOutTransferResult USBOutTransferResult HTMLPortalElement PortalActivateEvent PortalHost IdleDetector Profiler HID HIDConnectionEvent HIDDevice HIDInputReportEvent BluetoothAdvertisingEvent BluetoothLEScan BluetoothManufacturerDataMap BluetoothServiceDataMap AbsoluteOrientationSensor Accelerometer AudioWorklet Cache CacheStorage Clipboard Credential CredentialsContainer CryptoKey DeviceMotionEvent DeviceMotionEventAcceleration DeviceMotionEventRotationRate DeviceOrientationEvent FederatedCredential Gyroscope Keyboard KeyboardLayoutMap LinearAccelerationSensor Lock LockManager MIDIAccess MIDIConnectionEvent MIDIInput MIDIInputMap MIDIMessageEvent MIDIOutput MIDIOutputMap MIDIPort MediaDeviceInfo MediaDevices MediaKeyMessageEvent MediaKeySession MediaKeyStatusMap MediaKeySystemAccess MediaKeys NavigationPreloadManager OrientationSensor PasswordCredential RTCIceTransport RelativeOrientationSensor Sensor SensorErrorEvent ServiceWorker ServiceWorkerContainer ServiceWorkerRegistration StorageManager SubtleCrypto Worklet XRDOMOverlayState XRLayer WakeLock WakeLockSentinel Scheduler TaskController TaskSignal PaymentCredential Bluetooth BluetoothCharacteristicProperties BluetoothDevice BluetoothRemoteGATTCharacteristic BluetoothRemoteGATTDescriptor BluetoothRemoteGATTServer BluetoothRemoteGATTService NativeIOFile NativeIOManager FragmentDirective LaunchParams LaunchQueue PaymentAddress PaymentRequest PaymentResponse PaymentMethodChangeEvent XRPlane XRPlaneDetectionState XRPlaneSet XRWorldInformation XRWorldTrackingState FaceDetector MerchantValidationEvent Presentation PresentationAvailability PresentationConnection PresentationConnectionAvailableEvent PresentationConnectionCloseEvent PresentationConnectionList PresentationReceiver PresentationRequest AmbientLightSensor Magnetometer AudioDecoder AudioFrame EncodedAudioChunk EncodedVideoChunk ImageDecoder Plane VideoDecoder VideoEncoder VideoFrame VideoTrackReader AuthenticatorAssertionResponse AuthenticatorAttestationResponse AuthenticatorResponse PublicKeyCredential Serial SerialConnectionEvent SerialPort FontManager XRImageTrackingResult XRHitTestResult XRHitTestSource XRRay XRTransientInputHitTestResult XRTransientInputHitTestSource BidirectionalStream QuicTransport ReceiveStream SendStream WebTransport TimestampTrigger CookieChangeEvent CookieStore CookieStoreManager XRBoundedReferenceSpace XRFrame XRInputSource XRInputSourceArray XRInputSourceEvent XRInputSourcesChangeEvent XRPose XRReferenceSpace XRReferenceSpaceEvent XRRenderState XRRigidTransform XRSession XRSessionEvent XRSpace XRSystem XRView XRViewerPose XRViewport XRWebGLLayer XRAnchor XRAnchorSet Scheduling OTPCredential XRLightEstimate XRLightProbe XRWebGLBinding XRDepthInformation FileSystemDirectoryHandle FileSystemFileHandle FileSystemHandle FileSystemWritableFileStream NDEFMessage NDEFReader NDEFReadingEvent NDEFRecord NDEFWriter TextDetector BarcodeDetector getScreens isMultiScreen showDirectoryPicker showOpenFilePicker showSaveFilePicker ontimezonechange onoverscroll onscrollend originPolicyIds speechSynthesis onpointerrawupdate trustedTypes crossOriginIsolated Notification ContentIndex MediaMetadata MediaSession CSSPropertyRule ScrollTimeline BackgroundFetchManager BackgroundFetchRecord BackgroundFetchRegistration webkitSpeechGrammar webkitSpeechGrammarList webkitSpeechRecognition webkitSpeechRecognitionError webkitSpeechRecognitionEvent TrustedHTML TrustedScript TrustedScriptURL TrustedTypePolicy TrustedTypePolicyFactory EventCounts PushManager PushSubscription PushSubscriptionOptions NavigatorUAData VTTRegion XSLTProcessor PaymentInstruments PaymentManager WebSocketStream SharedWorker SpeechSynthesisErrorEvent SpeechSynthesisEvent SpeechSynthesisUtterance GamepadAxisEvent GamepadButtonEvent PeriodicSyncManager IDBObservation IDBObserver IDBObserverChanges BluetoothUUID PictureInPictureEvent PictureInPictureWindow ResizeObserverSize DelegatedInkTrailPresenter Ink TrackDefault TrackDefaultList BeforeCreatePolicyEvent VideoPlaybackQuality PaymentRequestUpdateEvent RemotePlayback AnimationPlaybackEvent AnimationTimeline CSSAnimation CSSTransition DocumentTimeline AudioTrack AudioTrackList VideoTrack VideoTrackList PermissionStatus Permissions WorkletAnimation OverscrollEvent OffscreenCanvas OffscreenCanvasRenderingContext2D AccessibleNode AccessibleNodeList ComputedAccessibleNode VisibilityStateEntry CSSScrollTimelineRule MathMLElement MediaSource SourceBuffer SourceBufferList MediaStreamTrackGenerator MediaStreamTrackProcessor openDatabase webkitRequestFileSystem webkitResolveLocalFileSystemURL getComputedAccessibleNode getWindowSegments dir dirxml profile profileEnd clear table keys values debug undebug monitor unmonitor inspect copy queryObjects $_ $0 $1 $2 $3 $4 getEventListeners monitorEvents unmonitorEvents $ $$ $x"
				.split(" "), error
		);
	}
}
